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
      roomList: ''
    }
    this.userList = this.userList.bind(this)
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
    }).then(result => result.json())
      .then(
        fetch('/lobby/' + this.state.roomCode, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then (result => result.json())
          .then ((result) => this.setState({roomGuests: result.roomGuests})
          )
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
    console.log("LAG ", this.state.roomGuests)
    if(this.state.initialize2){
      return(
        <Redirect push to={'/Games/' + this.state.roomCode + '/' + this.state.username}/>
      )
    } else {
      return(
        <div>
          <h1> {this.props.match.params.roomCode} </h1>
          <span>
            <p>{this.userList()}</p>
            <button onClick={(event) => this.setState({initialize2: true})}>Go</button>
          </span>
        </div>
      )
    }
  }
}
