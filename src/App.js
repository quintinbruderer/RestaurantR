import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import logo from './assets/Logo/Restaurantr.svg';
import './App.css';
import HomePage from './frontEnd/homePage'
import Lobby from './frontEnd/Lobby'
import Games from './frontEnd/Games'
import Waiting from './frontEnd/Waiting'

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
          <Route path='/Lobby/:roomCode/:username' component={Lobby}/>
          <Route path='/Games/:roomCode/:username' component={Games}/>
          <Route path='/Waiting/:roomCode/:username' component = {Waiting}/>


          <div>
            {location === undefined
              ? 'Loading location'
              : location
                ? 'Your location is latitude ' + location.lat + ', and longitude ' + location.lng
                : 'No Location found'}
          </div>
            <div>
            </div>


        </div>
      </BrowserRouter>
    );
  }
}

export default App;
