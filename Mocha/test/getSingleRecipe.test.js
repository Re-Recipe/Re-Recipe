console.log("Starting Recipe API tests");

var chai = require("chai");
var chaiHttp = require("chai-http");

chai.use(chaiHttp);

var expect = chai.expect;

describe("Test Recipe API", function () {
  this.timeout(15000);

  // Test for successfully retrieving a single recipe
  it("Should retrieve a single recipe with the expected properties", function (done) {
    chai
      .request("http://localhost:8080")
      .get("/app/recipes/recipe002")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("recipe_ID", "recipe002");
        expect(res.body).to.have.property("recipe_name", "Spaghetti Bolognese");
        expect(res.body)
          .to.have.property("ingredients")
          .that.is.an("array")
          .with.length.above(0);
        expect(res.body.ingredients[0])
          .to.have.property("name")
          .that.is.a("string");
        expect(res.body.ingredients[0])
          .to.have.property("quantity")
          .that.is.a("number");
        expect(res.body.ingredients[0])
          .to.have.property("unit")
          .that.is.a("string");
        expect(res.body)
          .to.have.property("directions")
          .that.is.an("array")
          .with.length.above(0);
        expect(res.body.directions[0])
          .to.have.property("step")
          .that.is.a("string");
        done();
      });
  });

  // Test for retrieving a non-existent recipe and expecting a 404
  it("Should return 404 for a non-existent recipe", function (done) {
    chai
      .request("http://localhost:8080")
      .get("/app/recipes/nonExistentID")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("error").that.is.a("string");
        done();
      });
  });
});
