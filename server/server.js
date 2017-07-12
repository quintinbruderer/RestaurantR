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
const path = require('path')

const port = process.env.PORT || 3001;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

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

app.use(express.static(path.join(__dirname,'..','build')))

//creating a room in the db,
app.post('/room', (req, res) => {
  const {lat, lng, username} = req.body
   generateId((roomCode)=>{
     let room = new Room({
       roomCode: roomCode,
       ready: false,
       roomGuests:[ {
                    username: username,
                    gameDone: false,
                  }],
       roomLocation: {lat, lng},//
       roomList: [],
       roomResult: '',
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
  Room.findOne({roomCode: roomCode}, (err, room) => {
    room.roomGuests = room.roomGuests.concat({
                    username: username,
                    gameDone: false
                  })
    room.save((err, result) => {
      if (err){
        res.status(500).json(err)
      }
      res.json({room, result})
    })
  })
})

app.get('/lobby/:roomCode', (req, res) => {
 const roomCode = req.params.roomCode;
 Room.findOne({roomCode: roomCode}, (err, room) => {
     if (err){
       res.status(500).json(err)
     }
     res.json({roomGuests: room.roomGuests})
   }
 )
})

//zomato call
app.put('/zomato', (req, res) => {
  const {roomCode, lat, lng} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) => {
    zomatoCall(room.roomLocation.lat, room.roomLocation.lng, (err, restNameArr) =>{
      room.roomList = restNameArr;
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
        room.save((err, result) => {
          if (err){
          res.status(500).json(err)
          }
          res.json({room, result})
        })
  })
})

app.put('/gameDone', (req, res) =>{
  const {roomCode, username} = req.body
  console.log("LAWGF ", roomCode, username)
  Room.findOne({roomCode: roomCode}, (err, room)=>{
    console.log("LOG ", err)
    const guests = room.roomGuests;
    console.log("guests ", guests)
    for(let i = 0; i < guests.length; i++){
      if(guests[i].username === username){
        guests[i].gameDone = true;
      }
    }
    room.markModified('roomGuests')
    console.log('what the flip',room.roomGuests)
    room.save((err, result) => {
      if(err){
        res.status(500).json(err)
      } else {
        res.json({room, result})
      }
    })
  })
})

app.put('/allReady', (req, res) => {
  const {roomCode} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) =>{
        let guests = room.roomGuests
        let good2go = guests.every((userObj)=>{
          console.log("userObj ", userObj)
          return userObj.gameDone === true;
        })
        if(good2go){
          res.json({result: true})
        } else {
          res.json({result: false})
        }
  })
})

app.put('/resultFinder', (req,res) =>{
  const {roomCode} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) =>{
    res.json({result: room.roomResult})
  })
})

app.put('/genie', (req, res) =>{
  const {roomCode} = req.body
  Room.findOne({roomCode: roomCode}, (err, room) =>{
        let guests = room.roomGuests
        let good2go = guests.every((userObj)=>{
          console.log("userObj ", userObj)
          return userObj.gameDone === true;
        })
        console.log("good2go ", good2go)
        if(good2go){
          let results = room.restResults
          console.log("room.restResults ", room.restResults)
          let countedResults = results.reduce((allResults, result) => {
            console.log("allResults ", allResults, result)
            if (result in allResults){
              allResults[result]++;
            }
            else {
              allResults[result]= 1;
            }
            console.log("allResults ", allResults)

            return allResults;

          }, {})
          const maxKey = (obj) => {
          const voteArray = Object.keys(obj).map(key=>obj[key]);
          const maxVotes = Math.max.apply(null, voteArray);
          const choices = Object.keys(obj).filter(key => obj[key] === maxVotes)

            return choices
          }
          console.log("WE EATIN AT ", maxKey(countedResults))
          room.roomResult = maxKey(countedResults)
          room.markModified('roomResult')
          room.save((err, result) => {
            if(err){
              res.status(500).json(err)
            } else {
              res.json({result:  maxKey(countedResults)})
            }
          })
        } else {
          res.json({result: "hunger"})
        }
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

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


app.listen(port)
console.log("The server is working on Port " + port)
