const mongoose = require('mongoose');

const guest = mongoose.Schema()

const room = mongoose.Schema({
  roomCode: String,
  roomGuests:Array,
      //username
      //restChoices []
      //restResults []
  //I do not yet know if this works, or if we will use a "schema inside a schema"
  //roomSize: roomGuests.length
  roomLocation: {lat: Number,
                 lng: Number},
  roomList: Array,  //master room list. set interval to check individual guest arrays
  roomResult: Object
  });

const UserModel = mongoose.model('Room', room);

module.exports = UserModel;


//k
