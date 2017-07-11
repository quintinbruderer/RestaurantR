const mongoose = require('mongoose');

const guest = mongoose.Schema()

const room = mongoose.Schema({
  roomCode: String,
  roomGuests:Array,
      //username
      //restResults []
  //roomSize: roomGuests.length
  roomLocation: {lat: Number,
                 lng: Number},
  roomList: Array,  //master room list. set interval to check individual guest arrays
  restResults: Array,
  roomResult: Object
  });

const UserModel = mongoose.model('Room', room);

module.exports = UserModel;


//k
