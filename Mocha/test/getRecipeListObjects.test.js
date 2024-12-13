var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Test Get Recipe Object List', function () {

    var requestResult;
    var response;

    before(function (done) {
      chai.request("https://re-recipe.azurewebsites.net")
          .get("/app/discover")
          .end(function (err, res) {
  
              // Access the nested array if necessary
              requestResult = res.body.recipeList || res.body;
              response = res;
  
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              done();
          });
  });

    // 1. Make sure response is an array with 2+ recipes 
    it('Should return an array object with more than 2 recipes', function () {
      expect(response).to.have.status(200);
      expect(response.body).to.have.length.above(2);
  });

  it('The first entry in the array has known top-level properties', function () {
    expect(requestResult).to.be.an('array').that.is.not.empty;

    // Access the first recipe object
    const firstRecipe = requestResult[0];


    // Validate that the first recipe contains the expected top-level keys
    expect(firstRecipe).to.include.keys(
        '_id',
        'user_ID',
        'recipe_ID',
        'recipe_name',
        'meal_category',
        'recipe_versions',
        'image_url',
        'is_visible',
        'modified_flag'
    );

    // Check for optional `recipe_versions_details` property if it exists
    if (firstRecipe.hasOwnProperty('recipe_versions_details')) {
        expect(firstRecipe.recipe_versions_details).to.be.an('array');
    }
});

it('Every recipe object in the array has the expected structure', function () {
  expect(requestResult).to.be.an('array').that.is.not.empty;
  requestResult.forEach((recipe) => {
      // Check mandatory properties
      expect(recipe).to.have.property('_id').that.is.a('string');
      expect(recipe).to.have.property('user_ID').that.is.a('string');
      expect(recipe).to.have.property('recipe_ID').that.is.a('string');
      expect(recipe).to.have.property('recipe_name').that.is.a('string');

      // meal_category can be a string or an array
      expect(recipe).to.have.property('meal_category');
      if (Array.isArray(recipe.meal_category)) {
          recipe.meal_category.forEach((category) => {
              expect(category).to.be.a('string');
          });
      } else {
          expect(recipe.meal_category).to.be.a('string');
      }

      // Optional property validation
      expect(recipe).to.have.property('recipe_versions').that.is.an('array');
      expect(recipe).to.have.property('image_url').that.is.a('string');
      expect(recipe).to.have.property('is_visible').that.is.a('boolean');
      expect(recipe).to.have.property('modified_flag').that.is.a('boolean');

      // Validate optional key `recipe_versions_details`
      if (recipe.hasOwnProperty('recipe_versions_details')) {
          expect(recipe.recipe_versions_details).to.be.an('array');
      }
  });
});
});
