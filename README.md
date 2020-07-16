# CheckUp

## Server Info:

### GCP: Linux 10
### Activation command: sudo uwsgi --http-socket :80 --plugin python3 --wsgi-file mvp.py --callable app

# GIT INSTRUCTIONS

‘git pull’ - before doing anything

‘git branch’ - lists branches in repository (master being the production one)

‘git branch name’ - creates a copy of whichever branch you were on

‘git checkout name’ - switches branch to name

‘git push --set-upstream origin name’ - pushes new code to your branch

# Go to browser, and click on pull request
# Next, we can review the code before merging with master


### Set up Virtual Environment:
1) 'python3 -m venv venv'
2) 'source venv/bin/activate'

### Installing Flask:
'pip install flask flask_sqlalchemy flask_cors'

### Setting Flask run app:
'export FLASK_APP=flask_checkup.py'

### Running:
'python -m flask run' 


### Run in DEBUG mode: (set to 0 to turn off):
'export FLASK_DEBUG=1'  

### Install forms on Flask:
'pip install Flask-WTF --user' 
'pip install flask-wtf' 

### Install SQLalchemy:
'pip3 install Flask-sqlalchemy --user'
'pip install flask-sqlalchemy' 

### Importing DB
'from flask_checkup import db' 

### Install Flask Bcrypt
'pip install flask-bcrypt' 

### Install Flask Login
'pip install flask-login' 

## Minimal Architecture

### Flask:
- GET index: returns React index.html
- POST(params) search: uses params to query db and returns hospital data in json

### React:
- Home: search bar for procedure name, location, max radius
- Results: chart.js populated with prices at different locatioins and distance from location (google maps?)
