console.log('Starting test for Recipe Site');
var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;
chai.use(chaiHttp);

describe('Test Recipe List Retrieval', function () {
  this.timeout(15000);

  it('Should return a list of recipe objects', function(done) {
    chai.request('http://localhost:8080')
    .get('/app/recipes')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);

      // Check if the response body is an array
      expect(res.body).to.be.an('array');

      // Ensure there is at least one recipe object
      expect(res.body).to.have.length.above(0);

      // Check properties of the first object, including the category as an array
      if (res.body.length > 0) {
        expect(res.body[0]).to.include.keys('recipe_ID', 'recipe_name');
        
        // Check that 'category' is an array
        expect(res.body[0]).to.have.property('category').that.is.an('array');
      }

      done();
    });
  });
});
