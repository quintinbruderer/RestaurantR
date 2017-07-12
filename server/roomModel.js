const mongoose = require('mongoose');

const guest = mongoose.Schema()

const room = mongoose.Schema({
  roomCode: String,
  roomGuests:Array,
      //username
      //gameDone: false boolean
  roomLocation: {lat: Number,
                 lng: Number},
  roomList: Array,
  restResults: Array,
  roomResult: Array
  });

const UserModel = mongoose.model('Room', room);

module.exports = UserModel;
