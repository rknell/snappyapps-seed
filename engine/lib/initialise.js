var config = require("../../config.json");
var Structure = require("../../api/models/Structure");
var User = require("../../api/models/User");
var bCrypt = require('bcrypt');
var q = require("q");

function go() {

  if (config.admin.password === "abcd1234") {
    console.error("SECURITY ERROR:");
    console.error("You must change the default admin password in config.json to continue.");
    process.exit();
  } else {
    if (!Structure) {
      console.error("You must define a structure model. Please replace the structure model in /api/models/Structure.js to continue");
      process.exit();
    }
    if (!User) {
      console.error("You must define a USER model. Please replace the user model in /api/models/User.js to continue");
      process.exit();
    }

    generateStructure()
      .then(generateAdmin);


  }
}

function generateStructure() {
  var deferred = q.defer();

  Structure.model.findOne({name: "Primary"}).exec(function (err, doc) {
    if (!doc) {
      Structure.model.create({name: "Primary"}, function (err, doc) {
        console.log("Created default structure", JSON.stringify(doc, null, 2));
        deferred.resolve(doc);
      })
    } else {
      deferred.resolve(doc);
    }
  });

  return deferred.promise;
}

function generateAdmin(primaryStructure) {
  var deferred = q.defer();

  User.model.findOne({structure: primaryStructure._id, email: config.admin.email}).exec(function (err, doc) {
    if (err) {
      deferred.reject(err);
    } else if (!doc) {
      bCrypt.hash(config.admin.password, 8, function (err, hash) {
        User.model.create({
          name: "Admin User",
          email: config.admin.email,
          password: hash,
          structure: primaryStructure._id
        }, function (err, doc) {
          if (err) console.error("Error creating default admin user", err);
          else if (!doc) {
            console.error("Could not create default admin user", doc);
          } else {
            console.log(doc);
          }
        })
      })
    } else {
      console.log("Admin user already created");
    }
  });

  return deferred.promise;
}


module.exports = {
  go: go
};