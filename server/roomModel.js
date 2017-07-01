const mongoose = require('mongoose');

const room = mongoose.Schema({
  roomSize: Number,
  roomCode: String,
  roomGuests: Object,//I do not yet know if this works, or if we will use a "schema inside a schema"
  roomLocation: Object,
  roomList: Array,  //findOneandUpdate? with their results. May not work as intended....fuuuuuuuuuuuuuu
  roomResult: Object
  });

const UserModel = mongoose.model('Room', room);

module.exports = UserModel;



//k
