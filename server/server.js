const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')
const app = express();
const config = require('./config')
const User = require('./userModel')
const Room = require('./roomModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const body-parser = require('body-parser')
const react-bootstrap = require('react-bootstrap')
const react = require('react')
const react-dom = require('react-dom')

const port = process.env.PORT || 3001;
app.use(morgan('dev'));
//we can add middleware(?) later in here. Morgan will be a help.

mongoose.connect(config.database)

const users = {};



app.post('/room', (req, res) => {
  const {lat, lng} = req.body
  // Create room and send back code
})

app.put('/room', (req, res) => {
  const {code, name} = req.body
  //add user to a room and send a list of restaurants
})

app.post('/vote', (req, res) => {
  const {restaurant, approve, name, roomCode} = req.body
})

app.get('/room/:code', (req, res) => {
    const { code } = req.params
})

app.delete('/room', (req, res) => {
  const { code } = req.body
})

app.listen(port)
console.log("The server is working on Port " + port)
