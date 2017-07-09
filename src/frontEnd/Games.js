import React, {Component} from 'react';
import 'whatwg-fetch';

export default class Games extends Component {
  constructor(props){
    super(props)
    this.state = {
      roomCode: this.props.match.params.roomCode,
      username: this.props.match.params.username,
    }
  }


  render() {
    return (
      <div>
        <p>{this.state.username + ' is excited to play Hungry Games'}</p>
      </div>
    )
  }
}
