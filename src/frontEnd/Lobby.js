import React, { Component } from 'react';
import 'whatwg-fetch';



export default class Lobby extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: "",
      //restNameArr: [],
    }
    //this functions this.skdjalksjga;lksjd = this.slkdjagljd aldkf.bind(this)
    /*
    readyAndGo(){
      fetch('/setStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomCode: this.state.roomCode,
          ready: this.state.ready,
        })
      }).then(result => result.json())
      .then(json => console.log(json))
    }
    */


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
