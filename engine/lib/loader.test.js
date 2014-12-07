var rewire = require('rewire');
var expect = require('chai').expect;
var loader = rewire('./loader');
var EventEmitter = require('events').EventEmitter;

describe('loader', function () {
  describe('__loadModels', function () {
    it('should load the models', function (done) {
      loader.__loadModels()
        .then(function (result) {
          console.log(result);
          expect(result).to.exist;
          expect(result).to.be.an('array');
          expect(result[0].model).to.exist;
          expect(result[0].middleware).to.exist;
          done();
        })
        .catch(done);
    })
  })

  describe('loadApi', function () {
    it('should load the entire api', function (done) {
      loader.loadApi()
        .then(function (result) {
          console.log(result);
          expect(result).to.exist;
          done();
        })
        .catch(done)
    })
  })

  describe('__loadRoutes', function () {
    it('should load the routes', function (done) {
      loader.__loadRoutes()
        .then(function (result) {
          console.log(result);
          expect(result).to.exist;
          done()
        })
        .catch(done);
    })
  })

  describe('__space', function () {
    it('should return a space of 5', function () {
      expect(loader.__space(3).length).to.equal(3);
      expect(loader.__space(1).length).to.equal(1);
      expect(loader.__space(8).length).to.equal(8);
      expect(loader.__space(7).length).to.equal(7);
    })
  });

});
