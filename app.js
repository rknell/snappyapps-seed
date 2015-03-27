// Load Dependencies
// -----------------
engine = require('./engine/engine');

// Configure the engine
// --------------------
engine.config = {
  port: process.env.port || 8185,
  dbUri: process.env.DB_URI,
  apiPrefix: "/api"
};

/**
 * Setup the static views
 * ----------------------
 * Remove the default one below to just use static HTML
 * in the www/public directory
 */
engine.express.app.get('/', function (req, res) {
  res.redirect('/admin')
});

/**
 * Initialise
 * ----------
 * Initialise the app and mount the models and routes
 */
engine.init();
