// Load Dependencies
// -----------------
var express = require('./lib/express');
var mongoose = require('mongoose');
var loader = require('./lib/loader');

/**
 * Initialise the engine.
 * ----------------------
 * Call this after setting the appropriate functions
 */
function init() {
  mongoose.connect(engine.config.dbUri);

  loader.loadApi()
    .then(function (router) {
      express.app.use(engine.config.apiPrefix, router);
      express.listen(engine.config.port);
    });
}

/**
 * The engine object.
 * ------------------
 * @type {{config: {port: (*|number), dbUri: *, apiPrefix: string}, version: string, express: (expressApp|exports|*), mongoose: (*|exports), init: init}}
 */
var engine = {
  config: {
    port: process.env.port || 8185,
    dbUri: process.env.DB_URI,
    apiPrefix: "/api"
  },
  version: "0.0.1",
  express: express,
  mongoose: mongoose,
  init: init
};

module.exports = engine;
