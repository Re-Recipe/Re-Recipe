const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Test Recipe Creation and Cleanup", function () {
  this.timeout(15000); 
  
  // Variable to store recipce_ID
  let createdRecipeId; 

  // Sample data for recipe creation
  const sampleFormData = {
    user_ID: "placeholder-user-id",
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
    // Create a recipe using POST request
    chai
      .request("http://localhost:8080") // Replace with the correct base URL
      .post("/app/discover")
      .send(sampleFormData)
      .end(function (err, res) {
        if (err) {
          console.error("Error during POST request:", err);
          done(err); // Fail the test if POST request fails
        } else {
          console.log("POST Response Body:", res.body);

          // Ensure the response contains the created recipe ID
          if (res && res.body && res.body.recipe_ID) {
            console.log("Captured recipe_ID for cleanup:", res.body.recipe_ID);
            createdRecipeId = res.body.recipe_ID; 
          } else {
            console.warn("No recipe_ID found in the response body.");
          }

          // Save response for later
          response = res;
          done();
        }
      });
  });

  // 1. Make sure request was fine 
  it("Should return status 201 and a new recipe object", function () {
    expect(response).to.have.status(201); 
    expect(response.body).to.be.an("object"); 
  });
   
  // 2. Make sure the response body matches
  it("Should include required keys in the response body", function () {
    const requiredKeys = [
      "_id",
      "recipe_ID",
      "user_ID",
      "recipe_name",
      "meal_category",
      "recipe_versions",
      "image_url",
      "is_visible",
    ];
    expect(response.body).to.include.keys(...requiredKeys); // Check for required keys
  });
  
  // 3. Get the right details 
  it("Should return the correct recipe details", function () {
    expect(response.body.recipe_name).to.equal(sampleFormData.recipe_name);
    expect(response.body.meal_category).to.deep.equal(sampleFormData.meal_category);
    expect(response.body.image_url).to.equal(sampleFormData.image_url);
    expect(response.body.is_visible).to.equal(sampleFormData.is_visible);
  });
  
  // Clean it up and leave no crumbs 
  after(function (done) {
    if (createdRecipeId) {
      // Delete the created recipe using DELETE request
      chai
        .request("https://re-recipe.azurewebsites.net") 
        .delete(`/app/discover/${createdRecipeId}`)
        .end(function (err, res) {
          if (err) {
            console.error("Error during DELETE request:", err);
            done(err); 
          } else {
            console.log("Cleanup successful for recipe ID:", createdRecipeId);
            expect(res).to.have.status(200); 
          }
        });
    } else {
      console.warn("No recipe created, skipping cleanup.");
      done();
    }
  });
});