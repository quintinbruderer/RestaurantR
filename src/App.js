import React, { Component } from 'react';
import logo from './assets/Logo/Restaurantr.svg';
import './App.css';
import HomePage from './frontEnd/homePage'
import Lobby from './frontEnd/Lobby'

import geolocation from './frontEnd/geolocation';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount(){
    geolocation.getGeolocation(location => this.setState({location: location}));
    console.log(HomePage);
  }

  render() {
    const {location} = this.state
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        <HomePage />

        <p className="App-intro">
          username field, roomcode field, startroom button, joinroom button
            </p>
        <div>
          {location === undefined ? 'Loading location' :
           location ? 'The location is ' + location.lat + ', ' + location.lng : 'No Location found'}
        </div>
          <div>
            <p2>now it needs to make a different lobby page with a ready and start button
            then a game page with an updating list of result a user can say yes or no to
            that sends those results live to the database, then a results page that stops the
            game page and displays a result</p2>
          </div>

          <Lobby />
      </div>
    );
  }
}

export default App;
