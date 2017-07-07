const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const config = require('./config');
const User = require('./userModel');
const Room = require('./roomModel');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Zomato = require('zomato.js');
const zom = new Zomato('b3549408bdd1a9da0380f2f2aaf4efa6');
//const request = require('superagent');


const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const port = process.env.PORT || 3001;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//we can add middleware(?) later in here. Morgan will be a help.

mongoose.connect(config.database)

const users = {};

const randomString = (length) => {
    let result = '';
    for (var i = length; i > 0; --i) {
      result += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return result;
}

generateId = (cb) => {
  const roomID = randomString(4);
  Room.findOne({roomCode: roomID}, (err, room) => {
    console.log(room)
    if(room === null){
      cb(roomID)
    } else {
      generateId(cb)
    }
  })
}

//zomatoTest?
zomatoCall = (lat, lng, cb) => {
  zom.search({
    lat: lat,
    lon: lng
  })
  // .then(function(data) {
  //   console.log(data);
  // })
  // .then((response) => { console.log("RESPONE ", response)
  //    response.json()
  // })

  .then((response) =>{
    const restNameArr = response.map((obj)=> obj.name)
    cb(null, restNameArr)
  })
  .catch(function(err) {
    cb(err, null)
  })
};

app.put('/zomato', (req, res) => {
  const {roomCode, lat, lng} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) => {
    zomatoCall(room.roomLocation.lat, room.roomLocation.lng, (err, restNameArr) =>{
      room.roomList = restNameArr;
      const guests = room.roomGuests.slice()
      guests[0].restChoices = guests[0].restChoices.concat(restNameArr)
      room.roomGuests = guests;
      room.save((err, response) => {
        console.log(err, response)
        res.json(restNameArr)
      })
    });
  })
})




//creating a room in the db,
app.post('/room', (req, res) => {
  const {lat, lng, username} = req.body
  console.log("LOGs ", req.body)
  //room name generator as middleware
    //room name generator
   generateId((roomCode)=>{
     console.log("Where are we going to dinner" + username + "/w" + roomCode)
     let room = new Room({
       roomCode: roomCode,
       ready: false,
       roomGuests:[ {
                    username: username,
                    restChoices: [],
                    restResults: []
                  }],

       roomLocation: {lat, lng},//
       roomList: [],
       roomResult: {},

     })
       console.log("COONSOOL LAWG" , username)
     room.save((err, room) => {
       res.json({
         roomCode : roomCode
       })
     });
   })
})


app.put('/room', (req, res) => {
  const {roomCode, username} = req.body
  // this currently allows duplicate names, maybe fix that
  Room.findOne({roomCode: roomCode}, (err, room) => {
    console.log("CONSOLE LOG " , room)
    room.roomGuests = room.roomGuests.concat({
                    username: username,
                    restChoices: [],
                    restResults: []
                  })
    room.save((err, result) => {
      if (err){
        res.status(500).json(err)
      }
      res.json({room, result})
    })

  })

  //add user to a room
})

app.put('/setStatus', (req, res) => {
  const {roomCode, ready} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) => {
    room.ready = true;
    room.save((err, result) => {
      if (err){
        res.status(500).json(err)
      }
      res.json({room, result})
    })
  })
})
//request info to start game


app.get('/gameStart', (req,res) => {
  const {roomCode, ready} = req.params
  Room.findOne({roomCode: roomCode}, (err, room) =>{
    if (room.ready === true)
    return roomList
    console.log(roomList)//send array to game
  })
})



//array comparison, set interval to update contiunously?

app.put('/preferences', (req,res) =>{
  const {roomCode, username} = req.body
  Room.findOne({roomCode: roomCode}, (err, room)=>{
    room.roomGuests.restResults = //array made by username
  })
})


app.get('/result', (req, res) =>{
  const {roomcode} = req.params
  Room.findOne({roomCode: roomCode}, (err, room)=>{
      let commonValues = [];
      let i, j;
      let arr1Length = room.roomGuests[0].restResults.length;
      let arr2Length = room.roomGuests[1].restResults.length;
      for (i = 0; i < arr1Length; i++) {
        for (j = 0; j < arr2Length; j++) {
          if (arr1[i] === arr2[j]) {
            commonValues.push(arr1[i]);
          }
        }
      }
      room.roomResults = //array pushed from loop
  })
})




app.delete('/room', (req, res) => {
  const {roomCode} = req.body
  //delete collection with roomCode: roomCode from mongo
})

app.listen(port)
console.log("The server is working on Port " + port)
