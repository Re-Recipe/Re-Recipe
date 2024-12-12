const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Test Recipe Creation", function () {
  this.timeout(15000);

  let response;
  let createdRecipeId;

  // Sample data for recipe creation
  const sampleFormData = {
    user_ID: 'placeholder-user-id',
    recipe_name: "Test Recipe",
    meal_category: ["breakfast"], 
    cooking_duration: 30,
    serving_size: 4,
    ingredients: [{ name: "Flour", quantity: 1, unit: "cup" }],
    directions: [{ step: "Mix all ingredients." }],
    image_url: "https://example.com/image.jpg",
    is_visible: true,
  };

  before(function (done) {
    chai
      .request("https://re-recipe.azurewebsites.net")
      .post("/app/discover")
      .send(sampleFormData)
      .end(function (err, res) {
        if (err) {
          console.error("Error during POST request:", err);
        } else {
          console.log("Response Body:", res.body);
        }
        response = res;
        if (res && res.body && res.body._id) {
          createdRecipeId = res.body._id; // Saving the ID for cleanup below 
        }
        done();
      });
  });

  it("Should return status 201 and a new recipe object", function () {
    expect(response).to.have.status(201);
    expect(response.body).to.be.an("object");
  });

  it("Should include required keys in the response body", function () {
    expect(response.body).to.include.keys(
      "_id",
      "recipe_ID",
      "user_ID",
      "recipe_name",
      "meal_category",
      "recipe_versions",
      "image_url",
      "is_visible"
    );
  });

  it("Should return the correct recipe details", function () {
    expect(response.body.recipe_name).to.equal(sampleFormData.recipe_name);
    expect(response.body.meal_category).to.deep.equal(sampleFormData.meal_category);
    expect(response.body.image_url).to.equal(sampleFormData.image_url);
    expect(response.body.is_visible).to.equal(sampleFormData.is_visible);
  });

  // Cleanup: Delete the created recipe after tests
  after(function (done) {
    if (createdRecipeId) {
      chai
        .request("https://re-recipe.azurewebsites.net")
        .delete(`/app/discover/${createdRecipeId}`)
        .end(function (err, res) {
          if (err) {
            console.error("Error during DELETE request:", err);
          } else {
            console.log("Cleanup successful for recipe ID:", createdRecipeId);
          }
          done();
        });
    } else {
      console.warn("No recipe created, skipping cleanup.");
      done();
    }
  });
});