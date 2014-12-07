/*
This is a route that has no related model. They aren't directly related except by name. To add a new route
simply create a file with the format in this file.
 */
var nuts = 0;

function collectNuts(req, res) {
  req.session.nuts = nuts++;
  res.json({message: "Nuts Collected", count: nuts})
}

module.exports = {
  routes: [
    {
      path: "collectNuts",
      method: "get",
      fn: collectNuts,
      middleware: []
    }
  ],
  __collectNuts: collectNuts
};
