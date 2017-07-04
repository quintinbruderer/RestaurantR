const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')
const app = express();
const config = require('./config')
const User = require('./userModel')
const Room = require('./roomModel')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

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

app.get('/room', (req, res) => {
  res.json ({no: 'hi'})
})

//creating a room in the db,
app.post('/room', (req, res) => {
  const {lat, lng, username} = req.body
  console.log("LOGs ", req.body)
  //room name generator as middleware
    //room name generator
   generateId((roomID)=>{
     console.log("Where are we going to dinner" + username + "/w" + roomID)
     let room = new Room({
       roomCode: roomID,
       ready: false,
       roomGuests:[ {
                    username: username,
                    restChoices: []
                  }],

       roomLocation: {lat, lng},//
       roomList: [],
       roomResult: {},

     })
       console.log("COONSOOL LAWG" , username)
     room.save((err, room) => {
       res.json({
         roomID : roomID
       })
     });
   })
})

app.get('/setStatus/:roomID/:ready', (req, res) => {
  const {roomID, ready} = req.params;
  Room.findOneAndUpdate({ roomID: roomID},
                        {ready: ready === 'true'},
                        (err, room) => {
                          res.json({whatever: true})
                        })
})

app.put('/room', (req, res) => {
  const {roomCode, username} = req.body
  // currently allows duplicate names, maybe fix that
  Room.findOne({roomCode: roomCode}, (err, room) => {
    console.log("CONSOLE LOG " , room)
    room.roomGuests = room.roomGuests.concat({
                    username: username,
                    restChoices: []
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


// app.put('/zomatoCall', (req, res) => {
//   Room.findOneandUpdate({})
// })

app.post('/vote', (req, res) => {
  const {restaurant, approve, name, roomCode} = req.body
})
app.get('/setup', function(req, res){

  const username = new User({
    name: "",
  })

})
app.get('/room/:code', (req, res) => {
    const { code } = req.params
})

app.delete('/room', (req, res) => {
  const { code } = req.body
})

app.listen(port)
console.log("The server is working on Port " + port)
