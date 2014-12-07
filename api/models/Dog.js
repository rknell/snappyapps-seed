/*
This is a simple example of defining a model, simply define the schema and enter any middleware
in the module.exports call
 */

var mongoose = require('mongoose');

var schema = {
  name: String,
  age: Number
};

module.exports = {
  middleware: {
    find: [],
    create: [],
    update: [],
    remove: [],
    findById: [],
    search: []
  },
  model: mongoose.model('Dog', schema)
};
