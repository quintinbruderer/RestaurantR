import React, { Component } from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';

export default class Lobby extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
      username: this.props.match.params.username,
      roomGuests: '',
      initialize2: false,
      roomList: '',
      refreshId: ''
    }
    this.userList = this.userList.bind(this)
    this.getList = this.getList.bind(this)
  }

  componentDidMount() {
    fetch('/zomato', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomCode: this.state.roomCode,
              lat: this.state.lat,
              lng: this.state.lng})
    })
    .then(result => result.json())
    .then((result) => this.setState({refreshId: setInterval(this.getList.bind(this), 3000)}))
  }

  getList(){
    fetch('/lobby/' + this.state.roomCode, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then (result => result.json())
      .then ((result) => this.setState({roomGuests: result.roomGuests})
      )
  }

  userList(){
    return this.state.roomGuests.length > 0 ? this.state.roomGuests.map((userObj)=>
    <li id={userObj.username}>
      {userObj.username}
    </li>
  ) : ''
  }

  render(){

    if(this.state.initialize2){
        clearInterval(this.state.refreshId)
      return(
        <Redirect push to={'/Games/' + this.state.roomCode + '/' + this.state.username}/>
      )
    } else {
      return(
        <div>
          <h1> {this.props.match.params.roomCode} </h1>
          <p>Use this code to join this room.</p>
          <span>
            <p>{this.userList()}</p>
            <button className="btn" onClick={(event) => this.setState({initialize2: true})}>Go</button>
          </span>
        </div>
      )
    }
  }
}
