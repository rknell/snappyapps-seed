var nuts = 0;
module.exports = {
  collectNuts: function(req, res){
    req.session.nuts = nuts ++;
    res.json({message: "Nuts Collected", count: nuts})
  }
};
