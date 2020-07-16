import React from 'react';
import './App.css';
import Bar from './Navbar';
import Search from './Search';
import Display from './Display';
import Footer from './Footer';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super();
    this.state = { 
      data: null,
      location: null
    };
  }

  display = (data, location) => {
    this.setState({ data, location })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" component={Bar}/>          
          {this.state.data == null
            ? <Search display={this.display} /> 
            : <Display data={this.state.data} location={this.state.location} />
          }
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;