/**
 * Define a model by defining the mongoose schema. You can add mongoose plugins, express middleware
 * to handle security or anything else you would like to do that is directly related to the model
 *
 * These models will be picked up and api endpoints automatically exposed.
 *
 * This is more complex example, to see a simple example check the Dogs.js file.
 */

var SimpleTimestamps = require('mongoose-SimpleTimestamps').SimpleTimestamps;
var middleware = require('../middleware');
var mongoose = require('mongoose');

//Define Schema
//-------------
var schema = new mongoose.Schema({
  name: String,
  toys: [
    {
      name: String
    }
  ]
});

//Plugins
//-------------
schema.plugin(SimpleTimestamps);

//Object that is returned
//-------------
module.exports = {
  middleware: {
    find: [middleware.enoughNuts],
    create: [middleware.emptyMiddleware],
    update: [middleware.emptyMiddleware],
    remove: [middleware.emptyMiddleware],
    findById: [middleware.emptyMiddleware],
    search: [middleware.isLoggedIn]
  },
  model: mongoose.model('Cat', schema)
}
