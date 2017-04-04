/*
This is the account page, this is because most systems these days expect to be able to share
An account with multiple users, this way it is built in.
 */

var mongoose = require('mongoose');
var middleware = require('../middleware');

var schema = new mongoose.Schema({

  name: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  
});


module.exports = {
  middleware: {
    find: [middleware.isLoggedIn],
    create: [],
    update: [middleware.isLoggedIn],
    remove: [middleware.isLoggedIn],
    findById: [middleware.isLoggedIn],
    search: [middleware.isLoggedIn]
  },
  model: mongoose.model('Account', schema),
  schema: schema
};
