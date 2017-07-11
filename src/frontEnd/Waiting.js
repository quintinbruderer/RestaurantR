import React, { Component } from 'react';
import 'whatwg-fetch';

//this page is a waiting page displayed while slower users complete their survey
export default class Waiting extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
    }
  }
//set interval checking to see if restaurant has been found, then
//redirect to chosen restaurant page 

      render(){

        return(
        <div>
          <p>
          Waiting for others to finish voting
        </p>
        </div>
        )
      }


}
