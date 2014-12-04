var path = require('path');
var walk = require('walk');
var q = require('q');
var SimpleTimestamps = require('mongoose-SimpleTimestamps').SimpleTimestamps;
var engine;

function loadModules(opts, done) {
  var walker = walk.walk(opts.folder, {followLinks: false});
  var modules = [];

  walker.on('file', function (root, stat, next) {
    var current = path.join(root, stat.name)
    var extname = path.extname(current);

    if (extname === '.js' && (opts.filter === undefined || opts.filter(current))) {
      var module = require('../../' + current);
      module.__name = stat.name.split(".")[0];
      modules.push(module);
    }
    next();
  });

  walker.on('end', function () {
    done(modules);
  });
}

function loadModels(express, prefix, _engine) {
  console.log("Loading Models");
  engine = _engine;
  var deferred = q.defer();
  loadModules({
    folder: "./api/models"
  }, function (modules) {

    modules.forEach(function (model) {
      var apiPath = prefix + "/" + model.modelName;
      console.log(apiPath);
      express.app.post(apiPath + "/search", function (req, res) {
        find(req, res, model);
      });
      express.app.get(apiPath, function (req, res) {
        findAll(req, res, model);
      });

      express.app.get(apiPath + "/id/:id", function (req, res) {
        findById(req, res, model);
      });

      express.app.post(apiPath, function (req, res) {
        create(req, res, model);
      });
      express.app.put(apiPath, function (req, res) {
        update(req, res, model);
      });
      express.app.delete(apiPath + "/remove/:id", function (req, res) {
        remove(req, res, model);
      })
    });
    deferred.resolve(modules);
  });
  return deferred.promise;
}

function loadRoutes(express, prefix, _engine) {
  console.log("Loading Routes");
  engine = _engine;
  var deferred = q.defer();
  loadModules({
    folder: "./api/routes"
  }, function (modules) {

    modules.forEach(function (route) {
      var apiPath = prefix + "/" + route.__name;
      Object.keys(route).forEach(function (endPoint) {
        var epPath = apiPath + "/" + endPoint;
        var ep = route[endPoint];
        if (endPoint !== "__name" && endPoint !== "overrideModel") {
          console.log(epPath);
          express.app.post(epPath, ep);
          express.app.get(epPath, ep);
          express.app.put(epPath, ep);
          express.app.delete(epPath, ep);
          epPath += "/:id";
          express.app.post(epPath, ep);
          express.app.get(epPath, ep);
          express.app.put(epPath, ep);
          express.app.delete(epPath, ep);
        } else if(endPoint === "overrideModel") {
          express.app.get(apiPath, route.find);
          express.app.get(apiPath + "/")
        }
      });
    });
    deferred.resolve(modules);
  });
  return deferred.promise;
}

function findAll(req, res, model) {
  model
    .find({})
    .exec(function (err, docs) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(docs);
      }
    })
}

function search(req, res, model) {
  var query = req.body;
  model
    .find(query)
    .exec(function (err, docs) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(docs);
      }
    })
}

function findById(req, res, model) {
  model.findOne({_id: new mongoose.Types.ObjectId(req.params.id)})
    .exec(function (err, doc) {
      res.json(doc);
    });
}

function create(req, res, model) {
  var data = req.body;
  console.log(req.body);

  var newItem = new model(data);
  newItem.save(function (err, doc) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(doc);
    }
  })
}

function update(req, res, model) {
  var data = req.body;
  var id = new engine.mongoose.Types.ObjectId(data._id);
  model.findOneAndUpdate({_id: id}, data, function (err, doc) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(doc);
    }
  })
}

function remove(req, res, model) {
  var id = new engine.mongoose.Types.ObjectId(req.params.id);

  model.findOneAndRemove({_id: id}, function (err, doc) {
    if (err) {
      res.json(500, err);
    } else {
      if (!doc) {
        res.json(404, {message: "Delete failed, record not found"});
      } else {
        res.json(doc);
      }
    }
  })

}

module.exports = {
  loadModels: loadModels,
  loadRoutes: loadRoutes,
  __loadModules: loadModules
};
