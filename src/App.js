import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import logo from './assets/Logo/Restaurantr.svg';
import './App.css';
import HomePage from './frontEnd/homePage'
import Lobby from './frontEnd/Lobby'
import Games from './frontEnd/Games'

import geolocation from './frontEnd/geolocation';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    geolocation.getGeolocation(location => this.setState({location: location}));
    console.log(HomePage);
  }

  render() {
    const {location} = this.state
    return (
      <BrowserRouter>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
          </div>

          <Route exact path='/' component={HomePage}/>
          <Route path='/lobby/:roomCode/:username' component={Lobby}/>
          <Route path='/games/:roomCode/:username' component={Games}/>

          <p className="App-intro">
            username field, roomcode field, startroom button, joinroom button
          </p>
          <div>
            {location === undefined
              ? 'Loading location'
              : location
                ? 'The location is ' + location.lat + ', ' + location.lng
                : 'No Location found'}
          </div>
          <div>
            <p2>now it needs to make a different lobby page with a ready and start button then a game page with an updating list of result a user can say yes or no to that sends those results live to the database, then a results page that stops the game page and displays a result</p2>
          </div>


        </div>
      </BrowserRouter>
    );
  }
}

export default App;
