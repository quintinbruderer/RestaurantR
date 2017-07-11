import React, { Component } from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';


export default class Lobby extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
      username: this.props.match.params.username,
      roomGuests: ['future spot for guest list'],
      initialize2: false,
      roomList: ''
    }
    this.getList = this.getList.bind(this) //still trying to wrap my head around "this"
  }


  getList() {
    fetch('/lobby/' + this.state.roomCode + '/' + this.state.username, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {})
    // .then(json => {
    //   console.log('json ', json)
    //     this.setState({roomGuests: json.roomGuests})
    // })
  }  //trying to display users in room
  //maybe need a set interval

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
    .then(json => console.log(json))
  }


  render(){
    if(this.state.initialize2){
      return(
        <Redirect push to={'/Games/' + this.state.roomCode + '/' + this.state.username}/>
      )
    } else {
      return(
        <div>
          <h1> {this.props.match.params.roomCode} </h1>
          <span>
            <p>{this.state.roomGuests}</p>
            <button onClick={(event) => this.setState({initialize2: true})}>Go</button>
          </span>
        </div>
      )
    }
  }
}
