// Load dependencies
// -----------------
var path = require('path');
var walk = require('walk');
var q = require('q');
var router = require('express').Router();
var ObjectId = require('mongoose').Types.ObjectId;
var defaultActions = require('./defaultActions');

// Load variables
// --------------
var register = {};

router.get('/err/500', function(req, res){
  res.status(500).json({message: "Server Error"});
});

/**
 * Loads modules from a folder
 * @param opts {folder:''}
 * @param done
 */
function loadModules(opts, done) {
  var walker = walk.walk(opts.folder, {followLinks: false});
  var modules = [];

  walker.on('file', function (root, stat, next) {
    var current = path.join(root, stat.name);
    var extname = path.extname(current);

    if (extname === '.js') {
      var split = stat.name.split(".");
      if (split.length == 2) {
        var module = require('../../' + current);
        module.__name = stat.name.split(".")[0];
        modules.push(module);
      }
    }
    next();
  });

  walker.on('end', function () {
    done(modules);
  });
}

/**
 * Load the models and setup the express routes
 * @returns {deferred.promise|*}
 */
function loadModels() {
  var deferred = q.defer();
  loadModules({
    folder: "./api/models"
  }, function (modules) {

    modules.forEach(function (model) {

      var apiPath = "/" + model.model.modelName;

      addToRegister({
        path: apiPath + "/search",
        method: "post",
        fn: function (req, res) {
          defaultActions.search(req, res, model.model);
        },
        middleware: [model.middleware.search]
      });

      addToRegister({
        path: apiPath,
        method: "get",
        fn: function (req, res) {
          defaultActions.findAll(req, res, model.model);
        },
        middleware: [model.middleware.find]
      });

      addToRegister({
        path: apiPath + "/:id",
        method: "get",
        fn: function (req, res) {
          defaultActions.findById(req, res, model.model);
        },
        middleware: [model.middleware.findById]
      });

      addToRegister({
        path: apiPath,
        method: "post",
        fn: function (req, res) {
          defaultActions.create(req, res, model.model);
        },
        middleware: [model.middleware.create]
      });

      addToRegister({
        path: apiPath,
        method: "put",
        fn: function (req, res) {
          defaultActions.update(req, res, model.model);
        },
        middleware: [model.middleware.update]
      });

      addToRegister({
        path: apiPath + "/:id",
        method: "delete",
        fn: function (req, res) {
          defaultActions.remove(req, res, model.model);
        },
        middleware: [model.middleware.remove]
      });

    });
    deferred.resolve(modules);
  });
  return deferred.promise;
}

/**
 * Load the routes and the appropriate express endpoints
 * @returns {deferred.promise|*}
 */
function loadRoutes() {
  var deferred = q.defer();
  loadModules({
    folder: "./api/routes"
  }, function (modules) {
    modules.forEach(function (routeModule) {
      console.log(routeModule.__name);
      routeModule.routes.forEach(function (route) {

        addToRegister({
          path: "/" + routeModule.__name + "/" + route.path,
          method: route.method,
          fn: route.fn
        });

        if (route.path == "find") {
          addToRegister({
            path: "/" + routeModule.__name,
            method: "get",
            fn: route.fn,
            middleware: route.middleware
          })
        }

        if (route.path == "create") {
          addToRegister({
            path: "/" + routeModule.__name,
            method: "post",
            fn: route.fn,
            middleware: route.middleware
          })
        }

        if (route.path == "update") {
          addToRegister({
            path: "/" + routeModule.__name,
            method: "put",
            fn: route.fn,
            middleware: route.middleware
          })
        }

        if (route.path == "findById") {
          addToRegister({
            path: "/" + routeModule.__name + "/:id",
            method: "get",
            fn: route.fn,
            middleware: route.middleware
          })
        }

        if (route.path == "remove") {
          addToRegister({
            path: "/" + routeModule.__name,
            method: "delete",
            fn: route.fn,
            middleware: route.middleware
          })
        }

      });
    });
    deferred.resolve(modules);
  });
  return deferred.promise;
}

/**
 * Finalise endpoints and setup express
 * @returns {*}
 */
function actionRunLast() {
  Object.keys(register).forEach(function (apiPath) {
    Object.keys(register[apiPath]).forEach(function (method) {
      var fn = register[apiPath][method];
      console.log(method, space(8 - method.length), apiPath);
      router.route(apiPath)[method](fn)
    });
  });

  return q(router);
}

/**
 * Queue an item to have an express endpoint setup
 * The reason for the queue is it allows for subsequent function to override a previously defined one
 * @param data
 */
function addToRegister(data) {
  if (data.middleware) {
    data.middleware.forEach(function (middleware) {
      router[data.method](data.path, middleware);
    })
  }
  if (!register[data.path]) register[data.path] = {};
  var path = register[data.path];
  path[data.method] = data.fn;
}

/**
 * Generate a space for console logging
 * @param x
 * @returns {string}
 */
function space(x) {
  var res = '';
  while (x--) res += ' ';
  return res;
}

/**
 * Perform the entire round trip
 * @returns {Promise}
 */
function loadApi() {
  return loadModels()
    .then(loadRoutes)
    .then(actionRunLast);
}

module.exports = {
  loadApi: loadApi,
  __loadModels: loadModels,
  __loadRoutes: loadRoutes,
  __space: space,
  //__getFileList: getFileList,
  __loadModules: loadModules,
  __actionRunLast: actionRunLast,
  __loadModules: loadModules,
  addToRegister: addToRegister
};
