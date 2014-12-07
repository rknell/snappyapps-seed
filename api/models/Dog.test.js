
describe('dogModel', function(){
  describe('default', function(){
    it('should do a find', function(done){
      request(app)
        .get('/api/dog')
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        })
    })

    it('should search', function(done){
      request(app)
        .post('/api/dog/search')
        .send({name: "test"})
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        })
    })

    it('should findById', function(done){
      request(app)
        .get('/api/dog/123456789012345678901234')
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        })
    })

    it('should create a dog', function(done){
      request(app)
        .post('/api/dog')
        .send({name: "test"})
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        })
    })

    it('should update a dog', function(done){
      request(app)
        .put('/api/dog')
        .send({name: "test", _id: "123456789012345678901234"})
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        })
    })

    it('should delete', function(done){
      request(app)
        .delete('/api/dog/123456789012345678901234')
        .end(function(err, res){
          expect(res.status).to.equal(404);
          done();
        })
    })
  })
})
