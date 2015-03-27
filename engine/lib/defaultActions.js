ObjectId = require('mongoose').Types.ObjectId;

var Structure = require('../../api/models/Structure');
var q = require('q');

/**
 * Default find all function
 * @param req
 * @param res
 * @param model
 */
function findAll(req, res, model) {
  getStructureQuery({}, req.session.structureId)
    .then(function (query) {
      model
        .find(query)
        .exec(function (err, docs) {
          if (err) res.status(500).json(err);
          else res.json(docs);
        })
    })
}

/**
 * Default search function
 * @param req
 * @param res
 * @param model
 */
function search(req, res, model) {
  getStructureQuery(req.body).then(function (query) {
    model
      .find(query)
      .exec(function (err, docs) {
        if (err) res.status(500).json(err);
        else res.json(docs);
      })
  });
}

/**
 * Default findById function
 * @param req
 * @param res
 * @param model
 */
function findById(req, res, model) {
  getStructureQuery({_id: new ObjectId(req.params.id)}).then(function (query) {
    model.findOne(query)
      .exec(function (err, doc) {
        if (!doc) {
          res.status(404).json({message: "Record not found"});
        } else if (err) {
          res.status(500).json(err);
        } else {
          res.json(doc);
        }
      });
  })

}

/**
 * Default create function
 * @param req
 * @param res
 * @param model
 */
function create(req, res, model) {
  setStructureData(req.body, req.session.structureId).then(function(data){
    if (data._id) {
      //Update
      update(req, res, model)
    } else {
      //Create
      var newItem = new model(data);
      newItem.save(function (err, doc) {
        res.json(doc);
      })
    }
  })
}

/**
 * Default update function
 * @param req
 * @param res
 * @param model
 */
function update(req, res, model) {

  setStructureData(data, req.session.structureId).then(function(data){
    var id = new ObjectId(data._id);
    model.findOneAndUpdate({_id: id}, data, function (err, doc) {

      res.json(doc);
    })
  });

}

/**
 * Default delete/remove function
 * @param req
 * @param res
 * @param model
 */
function remove(req, res, model) {
  var id = new ObjectId(req.params.id);
  getStructureQuery({_id: id}).then(function(query){
    model.findOneAndRemove(query, function (err, doc) {
      if (!doc) {
        res.json(404, {message: "Delete failed, record not found"});
      } else {
        res.json(doc);
      }
    })
  })
}

/**
 *
 * @param query
 * @param structureId
 * @param options
 * - dontWarn: Dont issue a warning is no structure is present, default false (issue a warning);
 * @returns {*}
 */
getStructureQuery = function (query, structureId, options) {
  var deferred = q.defer();

  if(structureId){
    var structureArray = [];
    Structure
      .model
      .findById({_id: ObjectId(structureId)})
      .exec(function (err, structure) {
        if (!structure) {
          deferred.reject({message: "Structure not found"});
        } else {
          structure.children.forEach(function (child) {
            structureArray.push(ObjectId(child));
          });
          structureArray.push(ObjectId(structureId));
          query.structure = {$in: structureArray};
          console.log("Post structure query", query);
          deferred.resolve(query);
        }
      });
  } else {
    if(!options.dontWarn)
      console.warn("No structure set, and using a filtering query");
    deferred.resolve(query);
  }


  return deferred.promise;
};

/**
 *
 * @param data
 * @param structureId
 * @param options
 * - dontWarn: Dont issue a warning is no structure is present, default false (issue a warning);
 * @returns {*}
 */
setStructureData = function(data, structureId, options){
  //Handle if there is no structureId
  var deferred = q.defer();
  if(!structureId){
    if(!options.dontWarn)
      console.warn("No structure set and ");
    Structure.model.find({name: "Primary"}).exec(function(err, doc){
      data.structure = doc._id;
      deferred.resolve(data);
    })
  } else {
    data.structure = ObjectId(structureId);
    deferred.resolve(structureId)
  }

  return deferred.promise;
};

module.exports = {
  findAll: findAll,
  findById: findById,
  search: search,
  create: create,
  update: update,
  remove: remove
};