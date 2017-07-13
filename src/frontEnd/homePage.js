import React, {Component} from 'react';
import 'whatwg-fetch';
import geolocation from './geolocation';
import {Redirect} from 'react-router-dom';
import Facebook from './facebook';
import Zomato from 'zomato.js';
import PoweredByZom from '../assets/PoweredByZom.png';

const zom = new Zomato('b3549408bdd1a9da0380f2f2aaf4efa6')

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      makeUserName: '',
      lat: '',
      lng: '',
      roomCode: '',
      initialize: false,
      lucky: ''
    }
    this.imFeelingLucky = this.imFeelingLucky.bind(this)
    this.roomCreation = this.roomCreation.bind(this)
    this.joinTheParty = this.joinTheParty.bind(this)
  }

  componentDidMount() {
    geolocation.getGeolocation(location => this.setState({lat: location.lat,
                                                          lng: location.lng}));
  }
  imFeelingLucky() {
    zom.search({
      lat: this.state.lat,
      lon: this.state.lng
    })
    .then((result) => result.map((obj) => obj.name))
    .then((result) => {
      let randNum = (Math.floor(Math.random() * result.length-1));
      this.setState({lucky: result[randNum]})
    })
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
    }).then(this.setState({initialize: true}))

  }

  render() {
    if (this.state.initialize) {
      return <Redirect push to={'/Lobby/' + this.state.roomCode + '/' + this.state.username}/>
    } else {
      return (
        <div>
          <div>
            <span>
              <p>Enter a User Name to Create a Room</p>
              <input type="text" name="User Name" placeholder="username" id="username" onChange={(e) => this.setState({username: e.target.value})}></input>
              <button className="btn" value="Create Room" onClick={this.roomCreation}>Create Room</button>
              <p>Enter Username Above and the Room's Code Below to Join Existing Room</p>
              <input type="text" name="Room Code" placeholder="room code" onChange={(e) => this.setState({roomCode: e.target.value})}></input>
              <button className="btn" value="Join Room" onClick ={
              this.joinTheParty}>Join Room</button>
            </span>
          </div>
          <div>
            <p className="App-intro">
            Welcome to Restaurantr! This website will help you and your friends decide where to go to eat.
            </p>
          </div>
          <Facebook />
          <div>
            <button className="btn" onClick={this.imFeelingLucky}>I'm Feeling Lucky</button>
            <p>{this.state.lucky}</p>
        </div>
          <div>
            <a href="https://www.zomato.com" ><img src={PoweredByZom} alt="zomato" height="100" width="auto"></img> </a>
          </div>
        </div>
      )
    }
  }
}
