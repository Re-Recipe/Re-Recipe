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
                requestResult = res.body;
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

    // 2. Make sure first index has the right properties 
    it('The first entry in the array has known top-level properties', function () {
        // Check if the first recipe has the expected properties
        expect(requestResult[0]).to.include.keys('_id', 'user_ID', 'recipe_ID', 'recipe_name', 'meal_category', 'recipe_versions', 'image_url', 'is_visible', 'modified_flag', 'recipe_versions_details');
        expect(requestResult[0]).to.have.property('_id');
    });

    // 3. Check the rest 
    it('Every recipe object in the array has the expected structure', function () {
        response.body.forEach((recipe) => {
            // Top-level keys
            expect(recipe).to.have.property('_id').that.is.a('string');
            expect(recipe).to.have.property('user_ID').that.is.a('string');
            expect(recipe).to.have.property('recipe_ID').that.is.a('string');
            expect(recipe).to.have.property('recipe_name').that.is.a('string');
    
            // Validate meal_category as a string or an array (weirdly sometimes isn't?)
            expect(recipe).to.have.property('meal_category');
            if (Array.isArray(recipe.meal_category)) {
                recipe.meal_category.forEach((category) => {
                    expect(category).to.be.a('string');
                });
            } else {
                expect(recipe.meal_category).to.be.a('string');
            }
    
            expect(recipe).to.have.property('recipe_versions').that.is.an('array');
            expect(recipe).to.have.property('image_url').that.is.a('string');
            expect(recipe).to.have.property('is_visible').that.is.a('boolean');
            expect(recipe).to.have.property('modified_flag').that.is.a('boolean');
            expect(recipe).to.have.property('recipe_versions_details').that.is.an('array');
        });
    });
});
