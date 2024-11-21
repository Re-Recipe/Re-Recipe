const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Test Recipe List Retrieval", function () {
  this.timeout(15000);

  let response;
  let requestResult;

  // Pre-fetch the recipe list before running tests
  before(function (done) {
    chai
      .request("http://localhost:8080")
      .get("/app/discover") // Endpoint for retrieving the recipe list
      .end(function (err, res) {
        requestResult = res.body;
        response = res;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  // Test 1: Ensure the response is an array with more than 2 objects
  it("Should return an array of recipes with more than 2 objects", function () {
    expect(response).to.have.status(200); // Ensure a successful response
    expect(response.body).to.be.an("array"); // The response should be an array
    expect(response.body).to.have.length.above(2); // Ensure the array has more than 2 recipes
    expect(response).to.have.headers; // Check for headers in the response
  });

  // Test 2: Validate the top-level properties of each recipe
  it("Each recipe should have the expected top-level properties", function () {
    response.body.forEach((recipe) => {

      // Properties that it should have (high level)
      expect(recipe).to.include.keys(
        "modified_flag",
        "user_ID",
        "recipe_ID",
        "recipe_name",
        "meal_category",
        "recipe_versions",
        "image_url",
        "is_visible"
      );

      // Validate the types of the top-level fields
      expect(recipe.modified_flag).to.be.a("boolean");
      expect(recipe.user_ID).to.be.a("string");
      expect(recipe.recipe_ID).to.be.a("string");
      expect(recipe.recipe_name).to.be.a("string");
      expect(recipe.meal_category).to.be.an("array");
      expect(recipe.recipe_versions).to.be.an("array");
      expect(recipe.image_url).to.be.a("string");
      expect(recipe.is_visible).to.be.a("boolean");
    });
  });

  // Test 3: Validate the properties of each recipe version (more granular)
  it("Each recipe version should have the expected properties", function () {
    response.body.forEach((recipe) => {
      recipe.recipe_versions.forEach((version) => {
        expect(version).to.include.keys(
          "cooking_duration",
          "version_number",
          "serving_size",
          "ingredients",
          "directions"
        );

        expect(version.cooking_duration).to.be.a("number");
        expect(version.version_number).to.be.a("number");
        expect(version.serving_size).to.be.a("number");
        expect(version.ingredients).to.be.an("array");
        expect(version.directions).to.be.an("array");

        // Validate the properties of ingredients in each recipe version
        version.ingredients.forEach((ingredient) => {
          expect(ingredient).to.include.keys("name", "unit");
          expect(ingredient.name).to.be.a("string");
          expect(ingredient.unit).to.be.a("string");
        });

        // Validate the properties of directions in each recipe version
        version.directions.forEach((direction) => {
          expect(direction).to.include.keys("step");
          expect(direction.step).to.be.a("string");
        });
      });
    });
  });
});
