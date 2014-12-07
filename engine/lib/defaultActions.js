var ObjectId = require('mongoose').Types.ObjectId;

/**
 * Default find all function
 * @param req
 * @param res
 * @param model
 */
function findAll(req, res, model) {
  model
    .find({})
    .exec(function (err, docs) {
      res.json(docs);
    })
}

/**
 * Default search function
 * @param req
 * @param res
 * @param model
 */
function search(req, res, model) {
  var query = req.body;
  model
    .find(query)
    .exec(function (err, docs) {
      res.json(docs);
    })
}

/**
 * Default findById function
 * @param req
 * @param res
 * @param model
 */
function findById(req, res, model) {
  model.findOne({_id: new ObjectId(req.params.id)})
    .exec(function (err, doc) {
      res.json(doc);
    });
}

/**
 * Default create function
 * @param req
 * @param res
 * @param model
 */
function create(req, res, model) {
  var data = req.body;
  console.log(req.body);

  var newItem = new model(data);
  newItem.save(function (err, doc) {
    res.json(doc);
  })
}

/**
 * Default update function
 * @param req
 * @param res
 * @param model
 */
function update(req, res, model) {
  var data = req.body;
  var id = new ObjectId(data._id);
  model.findOneAndUpdate({_id: id}, data, function (err, doc) {

    res.json(doc);
  })
}

/**
 * Default delete/remove function
 * @param req
 * @param res
 * @param model
 */
function remove(req, res, model) {
  var id = new ObjectId(req.params.id);
  model.findOneAndRemove({_id: id}, function (err, doc) {
    if (!doc) {
      res.json(404, {message: "Delete failed, record not found"});
    } else {
      res.json(doc);
    }
  })

}

module.exports = {
  findAll: findAll,
  findById: findById,
  search: search,
  create: create,
  update: update,
  remove: remove
}
