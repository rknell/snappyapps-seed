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

var Cat = require('../models/Cat').model;
var middleware = require('../middleware');

function find(req, res) {
  Cat.find()
    .exec(function (err, docs) {
      res.json(err || docs);
    });
}

function override(req, res) {
  res.json("Overridden");
}

function search(req, res) {
  Cat.find(req.body)
    .exec(function (err, docs) {
      res.json(err || docs);
    })
}

module.exports = {
  routes: [
    {
      path: "find",
      method: "get",
      fn: find,
      middleware: []
    },
    {
      path: "search",
      method: "post",
      fn: search,
      middleware: [middleware.emptyMiddleware]
    },
    {
      path: "create",
      method: "post",
      fn: override,
      middleware: [middleware.emptyMiddleware]
    },
    {
      path: "update",
      method: "put",
      fn: override,
      middleware: [middleware.emptyMiddleware]
    },
    {
      path: "remove",
      method: "delete",
      fn: override,
      middleware: [middleware.emptyMiddleware]
    },
    {
      path: "findById",
      method: "get",
      fn: override,
      middleware: [middleware.emptyMiddleware]
    }
  ],
  __find: find,
  __override: override,
  __search: search
};
