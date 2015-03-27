/*
 This defines custom routes. It is pretty standard nodejs, you just need to add to the routes array
 the appropriate details so a route can be created with security and other bits.

 This example overrides the default find function in the Cat model by simply using the find name.
 To override the default functions on the models use the following names:

 find,
 create,
 update,
 remove,
 findById,
 search

 */

var User = require('../models/User').model;
var middleware = require('../middleware');
var bCrypt = require('bcrypt');
//var email = require("../services/email");

function login(req, res) {
  User.findOne({
    email: req.body.email
  })
    .exec(function (err, doc) {

      if (doc) {
        bCrypt.compare(req.body.password, doc.password, function (err, match) {
          if (err) {
            res.status(500).json(err);
          } else if (match) {
            doc.socket = req.session.socket;
            res.json(doc);
            req.session.user = doc;
            req.session.structureId = doc._doc.structure.toString();
            req.session.save();
            console.log("Current structure", req.session.structureId);
            doc.notifications.push({
              message: "You have logged back into the site",
              title: "Welcome Back!",
              icon: "",
              read: false,
              createdAt: new Date()
            });
            doc.save();
            io.to(doc.socket).emit("notification", {
              message: "You have a new notification",
              title: "Notification"
            });
          } else {
            res.status(400).json({message: "Username or password invalid"})
          }
        })
      } else if (err) {
        res.status(500).json(err);
      }
    })
}

function forgotPassword(req, res) {

  var email = req.params.email;

  var token = bCrypt.hash(new Date().toString() + email, 8, function (err, hash) {
    User.findOne({email: email})
      .exec(function (err, doc) {
        if (doc) {
          delete doc.password;
          doc.passwordToken = hash;
          doc.save(function (err, doc) {
            var message = "Please click here to reset your password: " + hash;
            console.log(message);
            //email.send(message, "rknell@snappyapps.com.au","Password Reset", "Ryan Knell", email, doc.name);
            res.json({success: true})
          })
        } else {
          res.status(404).json({message: "User not found"});
        }

      })
  })

}

function resetPassword(req, res) {
  var password = req.body.password;
  var token = req.body.token;

  User.findOne({passwordToken: token})
    .exec(function (err, doc) {
      if (err) {
        res.status(500).json(err);
      } else if (!doc) {
        res.status(404).json({message: "Password token invalid"})
      } else {
        bCrypt.hash(password, 8, function (err, hash) {
          doc.password = hash;
          doc.save(function (err, doc) {
            delete doc.password;
            req.session.user = doc;
            req.session.save();
            res.json(doc);
          })
        })
      }
    })

}

function create(req, res) {
  var data = req.body;
  console.log(req.body);

  if (data._id) {
    //Update
    update(req, res)
  } else {
    bCrypt.hash(data.password, 8, function (err, hash) {
      data.password = hash;
      //Create
      var newItem = new User(data);
      newItem.save(function (err, doc) {
        res.json(doc);
      })

    })
  }
}

function update(req, res) {
  var data = req.body;
  var id = new ObjectId(data._id);

  if (data.password) {
    bCrypt.hash(data.password, 8, function (err, hash) {
      data.password = hash;
    })
  }
  model.findOneAndUpdate({_id: id}, {$set: data}, function (err, doc) {
    res.json(doc);
  })
}

/**
 * Default find all function
 * @param req
 * @param res
 */
function findAll(req, res) {
  getStructureQuery({}, req.session.structureId).then(function (query) {
    User
      .find(query)
      .exec(function (err, docs) {
        if (err) {
          console.error(err);
          res.status(500).json(err)
        }
        else {
          docs.forEach(function (item) {
            delete item.password;
          });
          res.json(docs);
        }
      })
  })
}

/**
 * Default search function
 * @param req
 * @param res
 */
function search(req, res) {
  var query = new RegExp(req.body.query, "i");

  User
    .find({$or: [{name: query}, {email: query}, {mobile: query}, {landline: query}]})
    .exec(function (err, docs) {
      docs.forEach(function (item) {
        delete item.password;
      })
      res.json(docs);
    })
}

/**
 * Default findById function
 * @param req
 * @param res
 */
function findById(req, res) {
  User.findOne({_id: new ObjectId(req.params.id)})
    .exec(function (err, doc) {
      delete doc.password;
      res.json(doc);
    });
}

function registerSocket(req, res) {
  req.session.socket = req.body.socket;
  req.session.save();
  if (req.session.user) {
    User.findOne({_id: new ObjectId(req.session.user._id)})
      .exec(function (err, doc) {
        doc.socket = req.body.socket;
        doc.save(function (err) {
          if (err) res.status(500).json(err);
          else res.json({registered: true, data: doc});
        })
      });
  } else {
    //Its not an error, but we still need to return
    res.status(401).json({registered: false})
  }
}

function logOut(req, res){
  req.session.destroy();
  res.json({success: true});
}

function current(req, res){
  res.json(req.session.user);
}

module.exports = {
  routes: [
    {
      path: "login",
      method: "post",
      fn: login,
      middleware: []
    },
    {
      path: "create",
      method: "post",
      fn: create,
      middleware: []
    },
    {
      path: "update",
      method: "put",
      fn: update,
      middleware: [middleware.isLoggedIn]
    },
    {
      path: "find",
      method: "get",
      fn: findAll,
      middleware: [middleware.isLoggedIn]
    },
    {
      path: "search",
      method: "post",
      fn: search,
      middleware: [middleware.isLoggedIn]
    },
    {
      path: "findById",
      method: "get",
      fn: findById,
      middleware: [middleware.isLoggedIn]
    },
    {
      path: "registerSocket",
      method: "post",
      fn: registerSocket,
      middleware: []
    },
    {
      path: "forgotPassword/:email",
      method: "get",
      fn: forgotPassword,
      middleware: []
    },
    {
      path: "resetPassword",
      method: "post",
      fn: resetPassword,
      middleware: []
    },
    {
      path: "logout",
      method: "get",
      fn: logOut,
      middleware: []
    },
    {
      path: "current",
      method: "get",
      fn: current,
      middleware: []
    }
  ]
};
