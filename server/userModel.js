const mongoose = require('mongoose');

const user = mongoose.Schema({
  name: String,
  guest: Boolean,
  restaurant: Array //findOneandUpdate? with their results
  } //I do not yet know if this works, or if we will use a "schema inside a schema"
);

const UserModel = mongoose.model('User', user);

module.exports = UserModel;
