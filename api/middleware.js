/*
Define any middleware such as security policies here, you can check if someone is logged in, another function
is working or if the user has any specific roles to allow access to a function.
 */

function enoughNuts(req, res, next){
  if(req.session.nuts > 10){
    next();
  } else {
    next({status: 400, message: "Not enough nuts"})
  }
}

function isLoggedIn(req, res, next){
  if(!req.session.user) {
    return next({status: 401, message: "Not logged in"});
  }
  next();
}

function emptyMiddleware(req, res, next){
  //This middleware is used for testing to achieve 100% code coverage
  next();
}

module.exports = {
  enoughNuts: enoughNuts,
  isLoggedIn: isLoggedIn,
  emptyMiddleware: emptyMiddleware
};
