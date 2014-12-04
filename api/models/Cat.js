/*
 Following are all valid Schema Types.

 String
 Number
 Date
 Buffer
 Boolean
 Mixed
 Objectid
 Array
 */

var SimpleTimestamps = require('mongoose-SimpleTimestamps').SimpleTimestamps;

var schema = new mongoose.Schema({
  name: String,
  toys: [
    {
      name: String
    }
  ]
});

schema.plugin(SimpleTimestamps);

module.exports = mongoose.model('Cat', schema);
