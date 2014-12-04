express = require('./lib/express');
mongoose = require('mongoose');
loader = require('./lib/loader');

function init(){
  mongoose.connect(engine.config.dbUri);
  loader.loadModels(express, engine.config.prefix, engine)
    .then(function(){
      return loader.loadRoutes(express, engine.config.prefix, engine);
    })
    .then(function(){
      engine.express.listen(engine.config.port);
    });

}

var engine = {
  config: {
    port: process.env.port || 8185,
    dbUri: process.env.DB_URI,
    prefix: "/api"
  },
  version: "0.0.1",
  express: express,
  mongoose: mongoose,
  init: init
};

module.exports = engine;
