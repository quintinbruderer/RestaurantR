import React, { Component } from 'react';
import logo from './assets/Logo/Restaurantr.svg';
import './App.css';
//import gmap from 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCr6EwvdOcCpVEe5Xir9aLi_neVGEu6THA'
import Quinn from './quinnTestReq'
import FBLogin from './facebooktest'
import 'whatwg-fetch'

class App extends Component {

  state = {
    recommendation : <Quinn key={Math.random()}/>
  }


//fetch('/quinnTestReq' + this.state.finished )


  render() {


    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log('Oh snap')
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

        </div>
        <p className="App-intro">
          Press the button to find a place to eat!
        </p>
        <div>
          <button onClick={()=>this.setState({recommendation: <Quinn key={Math.random()}/>})}> Where are we going? </button>
        </div>
                {this.state.recommendation}

        <div id="FBbutton">
          <FBLogin />
        </div>
      </div>
    );
  }
}



export default App;
