express = require('./lib/express');
mongoose = require('mongoose');
loader = require('./lib/loader');
mockgoose = require('mockgoose');
expect = require('chai').expect;
request = require('supertest');
testenv = {
  development: true
}
app = express.app;

mockgoose(mongoose);


before(function (done) {
  mongoose.connect("mongodb://localhost/placeholder");

  loader.loadApi()
    .then(function (router) {
      console.log("Loaded routes");
      express.app.use("/api", router);
      console.log("Setup listening");
      express.listen(8185, true);
      console.log("Done initialising");
      done();

    });

});
