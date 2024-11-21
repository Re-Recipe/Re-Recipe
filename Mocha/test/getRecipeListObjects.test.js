const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Test Recipe List Retrieval", function () {
  this.timeout(15000);

  let response;

  // Pre-fetch the data before running tests
  before(function (done) {
    chai
      .request("http://localhost:8080")
      .get("/app/discover")
      .end(function (err, res) {
        requestResult = res.body;
        response = res;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  // 1. Make sure it's an array of recipes
  it("Should return an array of recipes", function () {
    // Check that the response body is an array
    expect(response.body).to.be.an("array");
    // Ensure the array has at least two recipes
    expect(response.body).to.have.length.above(1);
  });

  // 2. Validate the properties in the arrays
  it("Each recipe should have the expected top-level properties", function () {
    response.body.forEach((recipe) => {
      // Check that the recipe object contains the necessary top-level fields
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

      // Validate the types of top-level fields
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

  // Make sure they have the expected properties
  it("Each recipe version should have the expected properties", function () {
    response.body.forEach((recipe) => {
      recipe.recipe_versions.forEach((version) => {
        // Validate fields in each recipe version
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

        // Validate fields in ingredients
        version.ingredients.forEach((ingredient) => {
          expect(ingredient).to.include.keys("name", "unit");
          expect(ingredient.name).to.be.a("string");
          expect(ingredient.unit).to.be.a("string");
        });

        // Validate fields in directions
        version.directions.forEach((direction) => {
          expect(direction).to.include.keys("step");
          expect(direction.step).to.be.a("string");
        });
      });
    });
  });
});
