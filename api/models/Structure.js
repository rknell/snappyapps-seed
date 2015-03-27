var mongoose = require('mongoose');
var middleware = require('../middleware');

var schema = new mongoose.Schema({
  name: String,
  children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Structure'}],
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Structure'}
});

module.exports = {
  middleware: {
    find: [],
    create: [],
    update: [],
    remove: [],
    findById: [],
    search: []
  },
  model: mongoose.model('Structure', schema),
  schema: schema
};
