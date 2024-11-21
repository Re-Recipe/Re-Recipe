console.log("Starting test for Recipe Site");
var chai = require("chai");
var chaiHttp = require("chai-http");

var expect = chai.expect;
chai.use(chaiHttp);

describe("Test Recipe List Retrieval", function () {
  this.timeout(15000);

  let response;

  // Pre-fetch the data before tests
  before(function (done) {
    chai
      .request("http://localhost:8080")
      .get("/app/discover")
      .end(function (err, res) {
        if (err) return done(err);
        response = res;
        done();
      });
  });

  // 1. Check general properties of the response
  it("Should return a successful HTTP response", function () {
    // Check that the response status is 200
    expect(response).to.have.status(200);
    // Ensure the body is not null
    expect(response.body).to.not.be.null;
  });

  // 2. Validate specific properties of the first item in the array
  it("Should return a list of recipe objects", function () {
    // Check if the response body is an array
    expect(response.body).to.be.an("array");
    // Ensure there is at least one recipe object
    expect(response.body).to.have.length.above(0);
  });

  // 3. Iterate through the array to validate the expected structure and properties of each object
  it("Each recipe object should have the expected properties", function () {
    // Validate properties of all recipe objects in the array
    response.body.forEach((recipe) => {
      expect(recipe).to.include.keys(
        "recipe_ID",
        "recipe_name",
        "category",
        "ingredients",
        "directions"
      );
      // Check that 'category' is an array
      expect(recipe.category).to.be.an("array");
    });
  });
});
