var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var app = express();

//app.use(favicon(path.join(__dirname, "..", "..", "www", "public", "favicon.ico")));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: '1234890sdlkjfu02',
  resave: false,
  saveUninitialized: true
}));

function listen(port) {
  try {
    // view engine setup
    var viewPath = path.join(__dirname, "..", "..", "www", 'views');
    app.set('views', viewPath);
    app.set('view engine', 'jade');

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });


    // error handlers

    // development error handler
    // will print stacktrace
    console.log("Current Environment: ", app.get('env'));
    if (app.get('env') === 'development') {
      app.use(function (err, req, res, next) {
        if (req.get('content-type') == "application/json") {
          var errOutput = {
            message: err.message,
            stack: err.stack
          }
          res.status(err.status || 500).json(errOutput)
        } else {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: err
          });
        }
      });
    } else {
      // production error handler
      // no stacktraces leaked to user
      app.use(function (err, req, res, next) {
        if (req.get('content-type') == "application/json") {
          res.status(500).json(err.message);
        } else {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: {message: "Debugging disabled in production, switch to development for more information"}
          });
        }
      });
    }

    var server = app.listen(process.env.PORT || port, function () {
      console.log('Listening on port %d', server.address().port);
    });
  } catch (e) {
    console.log(e);
  }
}

var expressApp = {
  app: app,
  listen: listen
};

module.exports = expressApp;
