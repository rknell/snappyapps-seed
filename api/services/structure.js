"use strict";

var Structure = require('../models/Structure');
var q = require('q');

function addStructure(name, parentId) {
  var deferred = q.defer();
  var newStructure = new Structure.model({
    name: name,
    parent: new ObjectId(parentId)
  });
  newStructure.save(function (err, doc) {
    getParents(doc._id)
      .then(function (parents) {
        parents.forEach(function (parent) {
          parent.children.push(doc);
          parent.save(function (err, doc) {
            console.log("Updated structure with new children", doc.name);
          })
        });
        deferred.resolve(doc);
      })
  });

  return deferred.promise;
}

function immediateChildren(structureId) {
  var deferred = q.defer();
  if(!structureId){
    deferred.reject({message: "No structureId provided"})
  } else {
    Structure.model
      .find({parent: ObjectId(structureId)})
      //.populate('children parent')
      .lean()
      .exec(function (err, docs) {
        if (err) deferred.reject(err);
        else deferred.resolve(docs);
      });
  }
  return deferred.promise;
}

function deleteStructure(structureId) {
  var deferred = q.defer();
  Structure.model.remove({_id: ObjectId(structureId)}, function (err) {
    if (!err) {
      getParents(structureId)
        .then(function (parents) {
          parents.forEach(function (parent) {
            parent.children.splice(parent.children.indexOf(ObjectId(structureId)), 1);
            parent.save(function (err, doc) {
              console.log("Removed child reference from parent structure", doc.name);
            })
          })
          deferred.resolve();
        })
    } else {
      deferred.reject(err);
    }
  });
  return deferred.promise;
}

function getParents(structureId, array, isNotFirst) {
  var deferred = q.defer();
  if (!array) array = [];
  Structure.model.findOne({_id: ObjectId(structureId)})
    .exec(function (err, doc) {
      if (isNotFirst)
        array.push(doc);

      if (doc.parent) {
        getParents(doc.parent.toString(), array, true)
          .then(function (array) {
            deferred.resolve(array);
          })
      } else {
        //Reached the top
        deferred.resolve(array);
      }
    });
  return deferred.promise;
}


module.exports = {
  addStructure: addStructure,
  immediateChildren: immediateChildren,
  deleteStructure: deleteStructure,
  getParents: getParents
};
