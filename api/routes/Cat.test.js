var Cat = require('./Cat');

describe('Cat', function () {
  describe('find', function(){
    it('should not error out', function(done){
      Cat.__find(null, {json: function(data){
        expect(data).to.exist;
        expect(data).to.not.be.a('Number');
        done();
      }});
    })
  })

  describe('search', function(){
    it('should not error out', function(done){
      Cat.__search({body: {name:"Test"}}, {json: function(data){
        expect(data).to.exist;
        expect(data).to.not.be.a('Number');
        done();
      }});
    })
  })

})
