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
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
//removed 1234567890 from CHARS to make easier codes 0 and 0 are annoying and switching to
//numbers on a phone is time consuming (at least on a app-using level)
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
                    username: username
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

app.get('/lobby/:roomCode/:username', (req, res) => {
  const roomCode = req.params.roomCode;
  Room.findOne({roomCode: roomCode}, (err, room) => {
    console.log(room.roomGuests) //is currently undefined
      if (err){
        res.status(500).json(err)
      }
      res.send(room.roomGuests)
      //res.json({roomGuests: room.roomGuests})
    }
  )
})

//zomato call
app.put('/zomato', (req, res) => {
  const {roomCode, lat, lng} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) => {
    zomatoCall(room.roomLocation.lat, room.roomLocation.lng, (err, restNameArr) =>{
      room.roomList = restNameArr;
    //hard bit with the odd bug, now might not need it
    //  const guests = room.roomGuests.slice()
    //  guests[0].restChoices = guests[0].restChoices.concat(restNameArr)
    //  room.roomGuests = guests;
      room.save((err, response) => {
        console.log(err, response)
        console.log(restNameArr)
        res.json(restNameArr)
      })
    });
  })
})

//send array to the game
app.put('/gameStart', (req,res) => {
  const {roomCode} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) =>{
      if (err){
        res.status(500).json(err)
      }
      res.json(room)
  })
})

//send user generated arrays back to the database
app.put('/preferences', (req,res) =>{
  const {roomCode, chosen} = req.body
  Room.findOne({roomCode: roomCode}, (err, room)=>{
        const roomRes = room.restResults.slice();
        room.restResults = roomRes.concat(chosen);
        console.log("LAWFG ", room.restResults)

        room.save((err, result) => {
          (console.log('haaa-aaayy ', result.roomGuests[0].restResults))
          if (err){
          res.status(500).json(err)
          }
          res.json({room, result})
          //this is working, only works for 1 user, also, BUT it doesnt save to db
          //copy array, slice, assign to copy, the odd bug
        })
  })
})

app.put('/result', (req, res) =>{
  const {roomCode} = req.body
  Room.findOne({roomCode: roomCode}, (err, room)=>{
      let commonValues = [];
      let i, j;
      let arr1Length = room.roomGuests[0].restResults.length;
      let arr2Length = room.roomGuests[1].restResults.length;
      for (i = 0; i < arr1Length; i++) {
        for (j = 0; j < arr2Length; j++) {
          if (room.roomGuests[0].restResults[i] === room.roomGuests[1].restResults[j]) {
            commonValues.push(room.roomGuests[0].restResults[i]);
          }
        }
      }
      res.send(commonValues)
      console.log("OK RAUNTS ", commonValues)
      //currently only compares 2 users
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
})

app.listen(port)
console.log("The server is working on Port " + port)
