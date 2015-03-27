/*
This is a simple example of defining a model, simply define the schema and enter any middleware
in the module.exports call
 */

var mongoose = require('mongoose');
var middleware = require('../middleware');
var bCrypt = require('bcrypt');

var schema = new mongoose.Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,
  landline: String,
  mobile: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  country: String,
  website: String,
  company: String,
  position: String,
  socket: String,
  passwordToken: String,
  passwordTokenExpiry: Date,

  notifications: [{
    message: String,
    title: String,
    icon: String,
    read: String,
    createdAt: Date
  }],

  //Avatar

  roles: [{
    name: String,
    value: Boolean
  }]
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
  model: mongoose.model('User', schema),
  schema: schema
};
