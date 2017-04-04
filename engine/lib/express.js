/**
 * This is just essentially the output you get when you generate an express app using the CLI tool
 *
 * It has been modified a little to work with the system - most notably breaking down the workflow into two functions
 * so other routes can be injected.
 */


// Express Dependencies
// --------------------
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var helmet = require('helmet');
var cors = require('cors');
var compression = require('compression');

// Initialise express
// ------------------
var app = express();

var http = require('http').Server(app);
io = require('socket.io')(http);

// Setup static routes first,
// so they can return without needing to hit the session store every time
// ----------------------------------------------
app.use(express.static(path.join(__dirname, "..", "..", "www")));

// Setup default middleware
// ------------------------
app.use(logger('dev'));

app.use(session({
  secret: '1234890sdlkjfu02',
  resave: true,
  saveUninitialized: false,
  rolling: true,
  cookie: {maxAge: 6000000},
  store: new MongoStore({url: process.env.DB_URI})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

/**
 * This function is called after the rest of the loader functions have been initialised
 * It is very important to ensure that all express routes have been loaded before calling this function
 * @param port
 * @param dontListen - Used for testing with supertest
 */
function listen(port, dontListen, production) {
  // Setup the view engine
  // ---------------------
  var viewPath = path.join(__dirname, "..", "..", "www", 'views');
  app.set('views', viewPath);
  app.set('view engine', 'jade');

  // Fallover to a 404 if no other routes are matched
  // ------------------------------------------------
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Error Handlers
  // --------------

  //Development error handler.
  //Will print a stacktrace
  console.log("Current Environment: ", app.get('env'));
  app.use(function (err, req, res, next) {

    if (req.get('content-type') == "application/json") {
      if (err) {
        var errOutput = {
          message: err.message,
          stack: err.stack
        }
        res.status(err.status).json(errOutput)
      } else {
        res.status(500).json(errOutput)
      }
    } else {
      res.status(err.status);
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });

  io.on('connection', function (socket) {
    socket.emit('welcome', {message: 'Socket.IO connected'});
    socket.on('send', function (data) {
      io.sockets.emit('message', data);
    });
  });

  http.listen(process.env.PORT || port, function () {
    console.log('Listening on port %d', http.address().port);
  });

}

var expressApp = {
  app: app,
  listen: listen
};

module.exports = expressApp;
