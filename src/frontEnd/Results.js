import React, { Component } from 'react';
import 'whatwg-fetch';

export default class Results extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
      result: ""
    }
  }  
//fetch endroom and reroute to page one, button?

    render(){
      return(
        <div>
          <p>Eat HERE SUCKA</p>
        </div>

      )

    }
}
