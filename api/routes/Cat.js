var Cat = require('../models/Cat');

module.exports = {
  find: function(req, res){
    if(Number(req.session.nuts) < 10 || !req.session.nuts){
      res.status(400).json({message: "The squirrel hasn't collected enough nuts yet"});
    } else {
      Cat.find()
        .exec(function(err, docs){
          if(err) res.status(500).json(err);
          res.json(docs);
        })
    }
  },
  create: function(req, res){

  },
  update: function(req, res){

  },
  remove: function(req, res){

  },
  findById: function(req, res){

  },
  test: function(req, res){
    res.json({success: true, body: req.body, params: req.params});
  },
  howmanynutsdoesthesquirrelhave: function(req, res){
    res.json(req.session.nuts);
  },
  overrideModel: true
};
