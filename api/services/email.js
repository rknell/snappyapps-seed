"use strict";
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_APIKEY);
var q = require('q');

function send(message, subject, fromEmail, fromName, toEmail, toName){

  var deferred = q.defer();
  var message = {
    "html": message,
    "subject": subject,
    "from_email": fromEmail,
    "from_name": fromName,
    "to": [
      {
        "email": toEmail,
        "name": toName,
        "type": "to"
      }
    ],
    "auto_text": true
  };

  mandrill_client.messages.send({ "message": message, async: true }, function (result) {
    deferred.resolve(result);
  }, function(e){
    deferred.reject(e);
  });

  return deferred.promise;
}



module.exports = {
  send: send
};
