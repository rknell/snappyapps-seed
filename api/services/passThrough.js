var q = require('q');
q.longStackSupport = true;

module.exports = function passThrough(fn, res) {

  return q(fn)
    .then(function (result) {
      //console.log("Returning", result);
      res.json(result);
      return q(result);
    })
    .catch(function (err) {
      console.error("Returning Error", err.stack, err);
      console.trace();
      if (err.statusCode) {
        res.json(err.statusCode, err);
      } else {
        res.json(500, err);
      }
    })
};
