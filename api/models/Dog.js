var schema = {
  name: String,
  age: Number
};

module.exports = mongoose.model('Dog', schema);
