import React, { Component } from 'react';
import 'whatwg-fetch';



export default class Lobby extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: "",
      //restNameArr: [],
    }
    this.readyAndGo = this.readyAndGo.bind(this) //still trying to wrap my head around "this"

  }
  readyAndGo(){
    fetch('/lobby/:roomCode/getUsers', {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => result.json()) //this is where we'll change state later
    .then(json => console.log(json))
  }

  render(){


    return(
      <div>
        <h1> {this.props.match.params.roomCode} </h1>
        <span>
        <p>A list of user names</p>
        <button>Go</button>
        </span>
      </div>
    )
  }

}
