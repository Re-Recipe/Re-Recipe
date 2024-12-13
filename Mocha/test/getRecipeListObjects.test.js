const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Test Single Recipe Retrieval", function () {
  this.timeout(15000);

  let response;
  let requestResult;

  // Pre-fetch the single recipe before running tests
  before(function (done) {
    chai
      .request("https://re-recipe.azurewebsites.net")
      .get("/app/discover/6758fde40425bcc380f4d640") // Endpoint for a specific recipe
      .end(function (err, res) {
        requestResult = res.body;
        response = res;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  // Test 1: Ensure the response is a single object
  it("Should return a single recipe object with expected properties", function () {
    expect(response).to.have.status(200); // Ensure a successful response
    expect(requestResult).to.be.an("object"); // The response should be an object
    expect(requestResult).to.include.keys(
      "_id",
      "user_ID",
      "recipe_ID",
      "recipe_name",
      "meal_category",
      "recipe_versions",
      "image_url",
      "is_visible",
      "modified_flag"
    );
  });

  // Test 2: Validate the top-level properties of the recipe
  it("The recipe should have the correct top-level property types", function () {
    expect(requestResult.recipe_ID).to.equal("6758fde40425bcc380f4d640");
    expect(requestResult.recipe_name).to.be.a("string");
    expect(requestResult.meal_category).to.be.an("array");
    expect(requestResult.recipe_versions).to.be.an("array");
    expect(requestResult.image_url).to.be.a("string");
    expect(requestResult.is_visible).to.be.a("boolean");
  });

  // Test 3: Validate the inner properties of recipe versions
  it("Each recipe version should have the expected properties", function () {
    requestResult.recipe_versions.forEach((version) => {
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

      // Validate the properties of ingredients in the recipe version
      version.ingredients.forEach((ingredient) => {
        expect(ingredient).to.include.keys("name", "unit");
        expect(ingredient.name).to.be.a("string");
        expect(ingredient.unit).to.be.a("string");
      });

      // Validate the properties of directions in the recipe version
      version.directions.forEach((direction) => {
        expect(direction).to.include.keys("step");
        expect(direction.step).to.be.a("string");
      });
    });
  });

  // Test 4: Does it match expected written content in DB? (for this specific recipe)
  it("Should match the unique fields for 6758fde40425bcc380f4d640", function () {
    expect(requestResult.recipe_ID).to.equal("6758fde40425bcc380f4d640");
    expect(requestResult.recipe_name).to.equal("Avocado Toast");
    expect(requestResult.meal_category).to.deep.equal(["Breakfast"]);
    expect(requestResult.image_url).to.equal(
      "https://bonabbetit.com/wp-content/uploads/2022/07/Avocado-toast-with-farmers-cheese-and-bacon-bits.jpg"
    );
    expect(requestResult.is_visible).to.be.true;
  });
});