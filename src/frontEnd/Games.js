import React, {Component} from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';


export default class Games extends Component {
  constructor(props){
    super(props)
    this.state = {
      lat: '',
      lng: '',
      roomCode: this.props.match.params.roomCode,
      username: this.props.match.params.username,
      roomList: [],
      chosen: [],
      initialize3: false
    }
    this.createList = this.createList.bind(this)
    this.makeChosenArr = this.makeChosenArr.bind(this)
    this.sendResults = this.sendResults.bind(this)
  }


  componentDidMount() {
    (console.log('componentDidMount()'))
    fetch('/gameStart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomCode: this.state.roomCode
      })
    })
    .then(result => result.json())
    .then(room => {
      console.log("room.roomlst ", room)
        this.setState({roomList: room.roomList})
        console.log('roomlist ', room)
      })
  }

  createList(){
    return this.state.roomList.map((choice)=>
    <li id={choice}>
      {choice}<input type="checkbox" value={choice} onChange= {(e)=>this.makeChosenArr(e)}/>
    </li>
  )}

  makeChosenArr(e){
    console.log(e.target.value, e.target.checked)
    var choices = this.state.chosen;
    if(e.target.checked ){
      choices.push(e.target.value)
    }
    else{
      choices = choices.filter((value)=>value !== e.target.value)
    }
    this.setState({chosen: choices})
      console.log("choices ", choices)
  }

  sendResults(){
    fetch('/preferences',{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({roomCode: this.state.roomCode,
                           chosen: this.state.chosen})
    }).then(result => result.json())
      .then(this.setState({initialize3: true}))
  }



  render() {
    if(this.state.initialize3){
      return (
          <Redirect push to={'/Waiting/' + this.state.roomCode}/>
      )
    }else{
      return(
        <div>
          <div>
          <p>{this.state.username + ' , check each restraunt you would be happy to eat at.'}</p>
          </div>
            <div>
              <ul>
                {this.createList()}
              </ul>
            </div>
          <div>
            <button onClick={this.sendResults}>Confirm</button>
          </div>
        </div>
      )
    }
  }
}
