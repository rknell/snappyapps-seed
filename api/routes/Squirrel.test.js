var Squirrel = require('./Squirrel');

describe('Squirrel', function () {
  describe('collectNuts', function(){
    it('should not error out', function(done){
      Squirrel.__collectNuts({
        session: {
          nuts: 0
        }
      }, {json: function(data){
        expect(data).to.exist();
        done();
      }})
    })
  })
})
