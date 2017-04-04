/*
Users model, with pre-wired login, logout and forgot password calls
 */

var mongoose = require('mongoose');
var middleware = require('../middleware');

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

  roles: [{
    name: String,
    value: Boolean
  }],

  pushNotificationTokens: [String]

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
