var expect = require('chai').expect;
var loader = require('./loader');
var engine = require('../index');

describe('loader', function(){
  it('should load models', function(done){
    loader.loadModels(engine.express)
      .then(function(result){
        console.log(result);
        expect(result).to.exist;
        expect(result).to.be.an('array');
        done();
      })
      .catch(done);
  })
});
