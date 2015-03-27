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

var Structure = require('../models/Structure').model;
var middleware = require('../middleware');
var passThrough = require('../services/passThrough');
var StructureLib = require('../services/Structure');

function setStructure(req, res) {
  // Set the primary structure
  req.session.structureId = req.body.id;
  io.to(req.session.socket).emit("structureChanged", {});
  req.session.save();
  res.status(200).send();
}

function create(req, res) {
  var name = req.body.name;
  var parent = req.session.structureId;
  if (!parent) {
    res.status(400).json({message: "You must provide a parent structure id"})
  } else {
    passThrough(StructureLib.addStructure(name, parent), res);
  }
}

function immediateChildren(req, res) {
  var structureid = req.params.id;

  Structure
    .find({_id: ObjectId(structureid)})
    .exec(function(err, doc){
      StructureLib.immediateChildren(structureid)
        .then(function(children){
          doc.children = children;
          res.json(children);
        })
    });

  //passThrough(StructureLib.immediateChildren(structureid), res);
}

function deleteStructure(req, res) {
  var structureId = req.params.id;
  passThrough(StructureLib.deleteStructure(structureId), res);
}

function findAll(req, res) {
  //passThrough(StructureLib.immediateChildren(req.session.structureId), res);
  //
  var structureid = req.session.structureId;
  Structure
    .findOne({_id: ObjectId(structureid)})
    .lean()
    .exec(function(err, doc){
      StructureLib.immediateChildren(structureid)
        .then(function(children){
          doc.children = children;
          res.json(doc);
        })
    });
}

/**
 * Resets the current structure to the primary one
 * @param req
 * @param res
 */
function reset(req, res) {
  req.session.structureId = req.session.user.structure;
  req.session.save();
  res.json({message: "Reset structure", success: true});
  io.to(req.session.socket).emit("structureChanged", {});
}

module.exports = {
  routes: [
    {
      path: "set",
      method: "post",
      fn: setStructure,
      middleware: []
    },
    {
      path: "create",
      method: "post",
      fn: create,
      middleware: []
    },
    {
      path: ":id/immediateChildren",
      method: "get",
      fn: immediateChildren,
      middleware: []
    },
    {
      path: "remove",
      method: "delete",
      fn: deleteStructure,
      middleware: []
    },
    {
      path: "find",
      method: "get",
      fn: findAll,
      middleware: [middleware.isLoggedIn]
    },
    {
      path: "reset",
      method: "get",
      fn: reset,
      middleware: []
    }
  ]
};
