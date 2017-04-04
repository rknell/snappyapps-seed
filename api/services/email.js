"use strict";
var q = require('q');
var sendgrid = require('sendgrid')(process.env.SENDGRID_APIKEY);

function send(message, subject, fromEmail, fromName, toEmail, options) {

  var deferred = q.defer();

  var email = new sendgrid.Email();

  email.addTo(toEmail);
  email.subject = subject;
  email.from = fromEmail;
  email.fromname = fromName;
  email.html = message;

  if(options){
    if(options.templateId){
      var templateId = options.templateId;
      email.addFilter('templates', 'enable', 1);
      email.addFilter('templates', 'template_id', templateId);
    }
  }

  sendgrid.send(email, function (err, json) {
    if (err) {
      deferred.reject(err);
      console.error(err);
    } else {
      deferred.resolve(json);
      console.log(json);
    }
  });

  return deferred.promise;
}

module.exports = {
  send: send
};
