import React, { Component } from 'react';
import 'whatwg-fetch';
import geolocation from './geolocation';


export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      makeUserName:'',
      lat: '',
      lng: '',
      roomCode: '',
    }
    this.roomCreation = this.roomCreation.bind(this)
    this.joinTheParty = this.joinTheParty.bind(this)
  }


  componentDidMount(){
    geolocation.getGeolocation(location => this.setState({lat: location.lat, lng: location.lng}));
    console.log(HomePage);
  }


  roomCreation(){
    console.log("anything");
    fetch('/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        lat: this.state.lat,
        lng: this.state.lng,
      })
    }).then(result => result.json())
    .then(json => console.log(json))
  }

  joinTheParty(){
    fetch('/room', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        roomCode: this.state.roomCode,
      })
    })
  }

  render(){
    return(
      <span>
          User Name
          <input type="text" name="User Name" onChange={(e) =>this.setState({username: e.target.value})}></input>
          <button value="Create Room" onClick={this.roomCreation.bind(this)}>Create Room</button>
          Join Existing Room
          <input type="text" name="Room Code" onChange={(e) =>this.setState({roomCode: e.target.value})}></input>
        <button value = "Join Room" onClick ={this.joinTheParty.bind(this)}> Join Room </button>
      </span>

    )
  }
}
