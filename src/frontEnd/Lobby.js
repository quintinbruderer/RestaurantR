import React, { Component } from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';


export default class Lobby extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
      username: this.props.match.params.username,
      roomGuests: ['I need to store some stuff', 'and more'],
      initialize2: false
    }
    this.getList = this.getList.bind(this) //still trying to wrap my head around "this"
  }


  getList() {
    fetch({'/lobby/' + this.state.roomCode + '/' + this.state.username}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => {
      console.log(result)
    })
    // .then(json => {
    //   console.log('json ', json)
    //     this.setState({roomGuests: json.roomGuests})
    // })
  }

  componentDidMount() {
    this.getList()
  }

  render(){
    if(this.state.initialize2){
      return(
        <Redirect push to={'/games/' + this.state.roomCode + '/' + this.state.username}/>
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
