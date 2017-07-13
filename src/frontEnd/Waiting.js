import React, { Component } from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';
import burger from '../assets/burger.png';

//this page is a waiting page displayed while slower users complete their survey
export default class Waiting extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
      username: this.props.match.params.username,
      initialize4: false,
      refreshWait: ''
    }
    this.readyCheck = this.readyCheck.bind(this)
    this.genie = this.genie.bind(this)
  }


  componentDidMount(){
    this.setState({refreshWait: setInterval(this.genie.bind(this),3000)})
  }

  genie(){
    fetch('/genie', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomCode: this.state.roomCode})
    })
    .then(result => result.json())
    .then(this.readyCheck)
      }

  readyCheck(){
    fetch('/allReady', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomCode: this.state.roomCode})
    }).then(result => result.json())
        .then(result => {
              console.log("LAWGSFDSFD ", result)
              if (result.result === true) {
                this.setState({initialize4: true})
              } else {
                console.log("NOT YEAT")
              }
            }
        )
  }

  render(){
    if(this.state.initialize4){
      clearInterval(this.state.refreshWait)
      return(
        <Redirect push to={'/Results/' + this.state.roomCode}/>
      )
      } else {
      return(
        <div>
          <p>
          Waiting for others to finish voting
        </p>
          <div>
          <img src={burger} id="burger" height="100" width="auto"></img>
          </div>
        </div>
        )
      }


  }
}
