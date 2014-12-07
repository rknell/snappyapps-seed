var expect = require('chai').expect;
var defaultActions = require('./defaultActions');

var model = new mongoose.model('Test', {
  name: String
});

var createdRecordId = null;

describe('defaultActions', function () {
  describe('create', function () {
    it('create a new record', function (done) {
      defaultActions.create({name: "First Name"}, {
        json: function (data) {
          console.log(data);
          createdRecordId = data._id;
          expect(data).to.exist
          expect(data).to.not.equal(500);
          done()
        }
      }, model);
    });

    it('should create a new record using superagent', function (done) {
      var _app = app;
      request(app)
        .post('/api/cat/')
        .send({name: "Test"})
        .end(function (err, res) {
          expect(res.status).to.equal(200);
          done();
        })
    })
  });

  describe('error handling', function () {
    it('should throw a 404', function (done) {
      request(app)
        .post('/kjadsfkjlasdfjk')
        .send("test")
        .end(function (err, res) {
          expect(res.status).to.equal(404);
          done();
        })
    })

    it('should throw a 404 with html feedback', function (done) {
      request(app)
        .post('/kjadsfkjlasdfjk')
        .send({name: "Test"})
        .accept('html')
        .end(function (err, res) {
          console.log(res.body);
          expect(res.status).to.equal(404);
          done();
        })
    });

    it('should throw a 500 error', function (done) {
      return request(app)
        .get('/api/err/500')
        .end(function (err, res) {
          expect(res.status).to.equal(500);
          done();
        })
    })
  });

  describe('update', function () {
    it('should try an update a record', function (done) {
      defaultActions.update({body: {_id: createdRecordId, name: "New name"}}, {
        json: function (data) {
          console.log(data);
          expect(data).to.not.equal(500);
          done()
        }
      }, model);
    });
  });

  describe('findAll', function () {
    it('should run a find all query', function (done) {
      defaultActions.findAll({}, {
        json: function (data) {
          console.log(data);
          expect(data).to.exist
          expect(data).to.not.equal(500);
          done()
        }
      }, model);
    })
  });

  describe('findById', function () {
    it('should run a find all query', function (done) {
      defaultActions.findById({params: {id: createdRecordId}}, {
        json: function (data) {
          console.log(data);
          expect(data).to.not.equal(500);
          done()
        }
      }, model);
    })
  });

  describe('search', function () {
    it('should run a find all query', function (done) {
      defaultActions.search({}, {
        json: function (data) {
          console.log(data);
          expect(data).to.exist
          expect(data).to.not.equal(500);
          done()
        }
      }, model);
    })
  });

  describe('remove', function () {

    it('fails to remove a record', function (done) {
      defaultActions.remove({params: {id: '123456789012345678901234'}}, {
        json: function (data) {
          console.log(data);
          expect(data).to.exist;
          expect(data).to.equal(404);
          done()
        }
      }, model);
    });

    it('should run a find all query', function (done) {
      defaultActions.remove({params: {id: createdRecordId}}, {
        json: function (data) {
          console.log(data);
          expect(data).to.exist;
          expect(data).to.not.equal(500);
          done()
        }
      }, model);
    })
  });


});
