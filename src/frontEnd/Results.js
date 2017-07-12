import React, { Component } from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';

export default class Results extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
      result: [],
      initialize5: false
    }
    this.allDone = this.allDone.bind(this)
  }

  componentDidMount() {
    fetch('/resultFinder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomCode: this.state.roomCode})
    })
    .then (res => res.json())
    .then(json => this.setState(json))
  }

  allDone(){
    fetch('/endroom', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({roomCode: this.state.roomCode})
    })
    .then(this.setState({initialize5: true}))
  }

    render(){
      if (this.state.initialize5){
        return <Redirect push to={'/'}/>
      } else {
      return(
        <div>
          <div>
            <p>EAT AT {this.state.result.join(', ')}</p>
          </div>
          <div>
          <button onClick={this.allDone}>Return to Home Page</button>
          </div>
        </div>
      )

    }
  }
}
