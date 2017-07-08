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


zomatoCall = (lat, lng, cb) => {
  zom.search({
    lat: lat,
    lon: lng
  })
  .then((response) =>{
    const restNameArr = response.map((obj)=> obj.name)
    cb(null, restNameArr)
  })
  .catch(function(err) {
    cb(err, null)
  })
};

//zomato call
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
    //room name generator
   generateId((roomCode)=>{
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
      room.save((err, room) => {
       res.json({roomCode : roomCode})
     });
   })
})

//add user to the room
app.put('/room', (req, res) => {
  const {roomCode, username} = req.body
  console.log('req from joinTheParty' , req.body);
  // this currently allows duplicate names, maybe fix that
  Room.findOne({roomCode: roomCode}, (err, room) => {
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
})

//send array to the game
app.put('/gameStart', (req,res) => {
  const {roomCode} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) =>{
      if (err){
        res.status(500).json(err)
      }
      res.send(room.roomlist)
  })
})



//array comparison, set interval to update contiunously?

/*
app.put('/preferences', (req,res) =>{
  const {roomCode} = req.body
  Room.findOne({roomCode: roomCode}, (err, room)=>{
<<<<<<< HEAD
    room.roomGuests.restResults =  //array made by username
  })
})

=======
    room.roomGuests.restResults =  5//array made by username
  })
})
*/
>>>>>>> cddc3b6651b45708e8dd50c3f8d903862c70a604
/*
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

*/
<<<<<<< HEAD


app.put('/endroom', (req, res) => {
  const {roomCode} = req.body
  Room.findOneAndRemove({roomCode:roomCode}, (err, room) =>{
    if (err){
      res.status(500).json(err)
    }
    res.json({success: true})
  })
=======
app.put('/gameStart', (req,res) => {
  const {roomCode} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) =>{
      console.log(room.roomList)
      if (err){
        res.status(500).json(err)
      }
      res.send(room.roomlist)
       //send array to game, respond with a .then in front end
 })
})


app.put('/endroom', (req, res) => {
 const {roomCode} = req.body
 Room.findOneAndRemove({roomCode:roomCode}, (err, room) =>{
   if (err){
     res.status(500).json(err)
   }
   res.json({success: true})
 })
>>>>>>> cddc3b6651b45708e8dd50c3f8d903862c70a604
})



app.listen(port)
console.log("The server is working on Port " + port)
