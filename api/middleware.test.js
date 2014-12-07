var middleware = require('./middleware')

describe('Middleware', function(){
  describe('enoughNuts', function(){
    it('should error out', function(done){
      middleware.enoughNuts({session: {nuts: 0}}, null, function(result){
        expect(result).to.exist;
        done();
      })
    })

    it('should not error out', function(done){
      middleware.enoughNuts({session: {nuts: 20}}, null, function(result){
        expect(result).to.not.exist;
        done();
      })
    })
  })

  describe('isLoggedIn', function(done){
    it('should not error out', function(done){
      middleware.isLoggedIn({session: {userId: true}}, null, function(result){
        expect(result).to.not.exist;
        done();
      })
    })

    it('should error out', function(done){
      middleware.isLoggedIn({session: {userId: false}}, null, function(result){
        expect(result.status).to.equal(401);
        done();
      })
    })
  })
})
