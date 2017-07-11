import React, { Component } from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';

//this page is a waiting page displayed while slower users complete their survey
export default class Waiting extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
      username: this.props.match.params.username,
      initialize4: false
    }
  }

  componentDidMount(){
    fetch('/genie', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomCode: this.state.roomCode})
    }).then(result => result.json())
  }

//this.setState({initialize4: true})



  render(){
    if(this.state.initialize4){
      return(
        <Redirect push to={'/Results/' + this.state.roomCode}/>
      )
      } else {
      return(
        <div>
          <p>
          Waiting for others to finish voting
        </p>
        </div>
        )
      }


  }
}
