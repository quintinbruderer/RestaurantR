import React, {Component} from 'react';
import 'whatwg-fetch';
import geolocation from './geolocation';
import {Redirect} from 'react-router-dom';

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      makeUserName: '',
      lat: '',
      lng: '',
      roomCode: '',
      initialize: false
    }
    this.roomCreation = this.roomCreation.bind(this)
    this.joinTheParty = this.joinTheParty.bind(this)
  }

  componentDidMount() {
    geolocation.getGeolocation(location => this.setState({lat: location.lat,
                                                          lng: location.lng}));
  }

  roomCreation() {

    console.log("anything");
    fetch('/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: this.state.username,
                            lat: this.state.lat,
                            lng: this.state.lng})
    }).then(result => result.json())
      .then(json => {
        this.setState({roomCode: json.roomCode,
                       initialize: true})
    })
  }

  joinTheParty() {
    fetch('/room', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: this.state.username, roomCode: this.state.roomCode})
    }).then(this.setState({initialize: true}))//put a concat here? since we are
                                              //   adding new users onto the existing???

  }

  render() {
    if (this.state.initialize) {
      return <Redirect push to={'/Lobby/' + this.state.roomCode + '/' + this.state.username}/>
    } else {
      return (
        <div>
        <div>
        <span>
          User Name
            <input type="text" name="User Name" onChange={(e) => this.setState({username: e.target.value})}></input>
            <button value="Create Room" onClick={this.roomCreation}>Create Room</button>
          Join Existing Room
            <input type="text" name="Room Code" onChange={(e) => this.setState({roomCode: e.target.value})}></input>
            <button value="Join Room" onClick ={
              this.joinTheParty}>Join Room</button>
        </span>
        </div>
          <div>
            <p className="App-intro">
            Please put a username to create a room, or a username and a code to join a room.
            </p>
          </div>
        </div>
      )
    }
  }
}
