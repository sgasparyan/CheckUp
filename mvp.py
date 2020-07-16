from flask import Flask, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import json
import sqlite3

app = Flask(__name__, static_folder='./web/build')
CORS(app)

# returns React search page SPA
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    print('index called')
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        print('sending index')
        return send_from_directory(app.static_folder, 'index.html')

# searches for hospitals based on procedure, location, radius
@app.route('/search/', methods=['POST'])
def search():
	data = request.get_json()
	print('data', data)

	conn = sqlite3.connect(r"./data/_modified/drg.db")
	conn.text_factory = str
	c = conn.cursor()
	
	try:
		searchbar = data['value'][:-7]
		c.execute("SELECT DISTINCT name, drg, description, AverageCoveredCharges, coords, ProcedureIndex, HospitalIndex FROM 'master' WHERE (upper(description) LIKE '%"+ searchbar + "%' or drg LIKE '"+ searchbar + "')AND (upper(description) NOT LIKE '%WITHOUT MCC%');")
		
		toDict = {}

		toDict['Hospitals'] = []

		first = True
		for row in c:

			
			price = row[3]
			if int(price) < 1:
				continue
			if first:
				# its actually description but whatever
				toDict['Name'] = str(row[2])
				toDict['DRG'] = str(row[1])
				first = False

			name = str(row[0])
			charge = float(row[3])
			x = row[4].split(',')[0]
			x = "".join(x.split())
			y = row[4].split(',')[1]
			y = "".join(y.split())
			p_index = ""
			h_index = ""
			for i in range (0, int(row[5])):
				p_index += '$'
			for i in range (0, int(row[6])):
				h_index += '$'
			toDict['Hospitals'].append({'name' : name, 'charge' : charge, 'x' : x, 'y' : y, 'p_index' : p_index, 'h_index' : h_index})

			#print(x)
			#print(y)
			# toDict['Hospitals'][row[0]] = {'charge': None, 'x': None, 'y': None, 'p_index' : None, 'h_index' : None }
			# toDict['Hospitals'][row[0]]['charge'] = row[3]
			# toDict['Hospitals'][row[0]]['x'] = float(x)
			# toDict['Hospitals'][row[0]]['y'] = float(y)
			# toDict['Hospitals'][row[0]]['p_index'] = row[5]
			# toDict['Hospitals'][row[0]]['h_index'] = row[6]


	except sqlite3.OperationalError as e:
			print("sqlite error: " + e.args[0])  # table companies already exists
	# data.procedure = search bar contents (drg or keyword of desc), data.location, data.radius
	print(toDict)
	return json.dumps(toDict)
	#pass # use data to write SQL queries, collate into json, and return

# autocompletes procedure name based on what's typed in so far
@app.route('/autocomplete/', methods=['GET'])
def autocomplete():
	baseDir = '/home/rohan/CheckUp/' 
	conn = sqlite3.connect(baseDir + "data/_modified/drg.db")
	conn.text_factory = str
	c = conn.cursor()
	
	try:
		c.execute("SELECT DISTINCT drg, description FROM 'master';")
		
		toDict = {}

		toDict['Suggestions'] = []
		for row in c:
			drg = row[0]
			description = row[1]
			result = (str(description) + ' - ' + str(drg)).strip()

			toDict['Suggestions'].append(str(result))
	except sqlite3.OperationalError as e:
			print("sqlite error: " + e.args[0])  # table companies already exists

	# data.procedure = search bar contents (drg or keyword of desc), data.location, data.radius
	print(toDict)
	return json.dumps(toDict)

    #return {'suggestions': []}	

if __name__ == '__main__':
	app.run(port=8080, debug=True)
