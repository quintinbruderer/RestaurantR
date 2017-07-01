import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import geolocation from './frontEnd/geolocation';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {



    }
  }

  componentDidMount(){
    geolocation.getGeolocation(location => this.setState({location: location}));




  }





  render() {
    const {location} = this.state
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {location === undefined ? 'Loading location' :
           location ? 'The location is ' + location.lat + ', ' + location.lng : 'No Location found'}
        </div>
      </div>
    );
  }
}

export default App;
