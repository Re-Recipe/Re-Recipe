import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";
import { RecipeModel } from "./RecipeModel";
import { DiscoverModel } from "./DiscoverModel";
import { ICookbook } from "../interfaces/ICookbook";

class CookbookModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<ICookbook>;
  public dbConnectionString: string;
  private discoverModel: DiscoverModel;
  private recipeModel: RecipeModel;

  /**
   * Constructor to initialize the database connection and set up the schema and model.
   * @param {string} DB_CONNECTION_STRING - MongoDB connection string.
   */
  public constructor(DB_CONNECTION_STRING: string, discoverModel) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.createSchema();
    this.createModel();
    this.discoverModel = discoverModel;
    this.recipeModel = new RecipeModel();
  }

  /**
   * Defines the schema for a cookbook with a user reference and arrays for modified and saved recipes.
   */
  public createSchema() {
    this.schema = new mongoose.Schema(
      {
        user_ID: { type: String, required: true, unique: true },
        title: { type: String, default: "My Cookbook" },
        modified_recipes: {
          type: [
            {
              modified_flag: { type: Boolean, default: false },
              user_ID: { type: String, required: true },
              recipe_ID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
              }, // Change from String to ObjectId
              recipe_name: { type: String, required: true },
              meal_category: [{ type: String }],
              recipe_versions: [
                { type: mongoose.Schema.Types.ObjectId, ref: "RecipeContents" },
              ],
              image_url: { type: String, required: true },
              is_visible: { type: Boolean, default: false },
            },
          ],
          default: [],
        },
      },
      { collection: "cookbooks", timestamps: true }
    );
  }

  /**
   * Connects to the MongoDB database and creates the Mongoose model based on the schema.
   */
  public async createModel() {
    try {
      if (!mongoose.models.Cookbook) {
        this.model = mongoose.model<ICookbook>("Cookbook", this.schema); // Define the model if it doesn't exist
        console.log("Created Cookbook model.");
      } else {
        this.model = mongoose.models.Cookbook; // Use the existing model
        console.log("Using existing Cookbook model.");
      }
    } catch (error) {
      console.error("Error creating Cookbook model:", error);
    }
  }

  public async createCookbook(
    userId: string,
    title: string = "myCookbook"
  ): Promise<void> {
    try {
      console.log(
        `Creating cookbook for user_ID: ${userId} with title: ${title}`
      );

      const existingCookbook = await this.model
        .findOne({ user_ID: userId })
        .exec();
      if (existingCookbook) {
        console.log(`Cookbook already exists for user_ID: ${userId}`);
        return;
      }

      const newCookbook = new this.model({
        user_ID: userId,
        title,
        modified_recipes: [],
      });

      const savedCookbook = await newCookbook.save();
      console.log("New cookbook created:", savedCookbook);
    } catch (error) {
      console.error("Error creating cookbook:", error);
      throw new Error("Cookbook creation failed.");
    }
  }

  public async copyRecipesFromDiscover(
    response: any,
    recipe_IDs: any[],
    user_id: string
  ): Promise<void> {
    console.log("here in cookbookModel");

    try {
      var ObjectId = require("mongoose").Types.ObjectId;
      const discoverCollection = mongoose.connection.collection("discover");
      // Fetch all the needed recipes from the Discover collection
      const objectIdRecipeIDs = recipe_IDs.map((id) => new ObjectId(id));

      const originalRecipes = await discoverCollection
        .find({ recipe_ID: { $in: objectIdRecipeIDs } })
        .toArray();
      // let id = new ObjectId("6741035b0a68f1169e0d8190");
      // const originalRecipes2 = await discoverCollection.findOne({
      //   recipe_ID: id,
      // });
      console.log("og: ", originalRecipes);
      // originalRecipes.push(originalRecipes2);

      // console.log(originalRecipes2);

      if (!originalRecipes || originalRecipes.length === 0) {
        return response.status(404).json({
          error: "No recipes found in Discover with the provided IDs!",
        });
      }

      // const userCookbook = await cookbookCollection.findOne({ user_ID }).modified_r
      const filter = { user_ID: user_id };

      const update = {
        $push: { modified_recipes: { $each: originalRecipes } },
      };

      const userCookbook = await this.model.findOneAndUpdate(filter, update);
      await userCookbook.save();

      console.log("Updated cookbook for user:", user_id);
      return response.status(200).json();
    } catch (error) {
      console.error("Failed to copy recipes from Discover:", error);
      response
        .status(500)
        .json({ error: "Failed to copy recipes from Discover" });
    }
  }
  // public async createRecipe(response: any, recipeData: IRecipe) {
  //   try {
  //     console.log("Creating modified recipe with data:", recipeData);

  //     let savedRecipe;

  //     // Use ObjectId for recipe_ID (MongoDB's native identifier)
  //     const recipeIdObjectId = new mongoose.Types.ObjectId(); // Generate new ObjectId

  //     let existingRecipe = await this.recipeModel.recipe.findOne({
  //       recipe_ID: recipeIdObjectId, // Search with ObjectId
  //     });

  //     if (existingRecipe) {
  //       savedRecipe = existingRecipe;
  //       console.log("Recipe already exists:", savedRecipe);
  //     } else {
  //       const newRecipe = new this.recipeModel.recipe({
  //         ...recipeData,
  //         recipe_ID: recipeIdObjectId, // Use ObjectId here
  //         modified_flag: false,
  //       });

  //       console.log("Saving new recipe:", newRecipe);
  //       savedRecipe = await newRecipe.save();
  //       console.log("New Recipe saved:", savedRecipe);

  //       // Ensure user_ID is passed in the recipe contents
  //       const recipeVersion = new RecipeContentsModel({
  //         recipe_ID: savedRecipe._id,
  //         user_ID: recipeData.user_ID, // Include user_ID
  //         cooking_duration: recipeData.cooking_duration || 25,
  //         serving_size: recipeData.serving_size || 4,
  //         ingredients: recipeData.ingredients || [],
  //         directions: recipeData.directions || [],
  //         version_number: 0, // Assuming it's the first version
  //       });

  //       console.log("Creating new recipe version:", recipeVersion);
  //       const savedRecipeContents = await recipeVersion.save();
  //       console.log("New Recipe version saved:", savedRecipeContents);

  //       // Add the saved recipe contents to the recipe's versions array
  //       savedRecipe.recipe_versions.push(savedRecipeContents._id);
  //       await savedRecipe.save();
  //       console.log(
  //         "Recipe version added to recipe:",
  //         savedRecipe.recipe_versions
  //       );
  //     }

  //     // Now, create the Discover document linking to the saved recipe
  //     const newDiscoverDocument = new this.model({
  //       recipeList: [savedRecipe._id], // Ensure the recipeList contains the saved recipe ID
  //       modified_flag: false,
  //       user_ID: recipeData.user_ID || "user005", // Ensure user_ID is passed here
  //       recipe_ID: recipeIdObjectId, // Use ObjectId here
  //       recipe_name: recipeData.recipe_name || savedRecipe.recipe_name,
  //       meal_category: recipeData.meal_category || [],
  //       recipe_versions: savedRecipe.recipe_versions || [],
  //       image_url:
  //         recipeData.image_url ||
  //         "https://www.the-sun.com/wp-content/uploads/sites/6/2020/08/tp-graphic-rihanna-chef.jpg",
  //       is_visible:
  //         recipeData.is_visible !== undefined ? recipeData.is_visible : false,
  //     });

  //     console.log("Creating new Discover document:", newDiscoverDocument);
  //     await newDiscoverDocument.save();
  //     console.log("New Discover document saved:", newDiscoverDocument);

  //     response.status(201).json(savedRecipe);
  //   } catch (error) {
  //     console.error("Error adding recipe to Discover:", error);
  //     response.status(500).json({ error: "Failed to create new recipe" });
  //   }
  // }
  /**
   * Removes a recipe from the user's cookbook.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user.
   * @param {string} recipeId - The ID of the recipe to remove.
   * @returns {Promise<void>}
   */
  public async removeRecipeFromCookbook(
    response: any,
    userId: string,
    recipeId: string
  ): Promise<void> {
    try {
      const cookbook = await this.model.findOne({ user_ID: userId }).exec();
      if (!cookbook) {
        return response.status(404).json({ error: "Cookbook not found" });
      }

      const recipeIndex = cookbook.modified_recipes.findIndex(
        (id: mongoose.Types.ObjectId) => id.toString() === recipeId
      );

      if (recipeIndex === -1) {
        return response
          .status(404)
          .json({ error: "Recipe not found in cookbook" });
      }

      cookbook.modified_recipes.splice(recipeIndex, 1);
      await cookbook.save();

      response.json({
        message: `Modified recipe with ID ${recipeId} deleted successfully.`,
      });
    } catch (error) {
      console.error("Failed to remove recipe from the cookbook:", error);
      response
        .status(500)
        .json({ error: "Failed to remove recipe from cookbook" });
    }
  }

  // ############################### above is fixed

  /**
   * Adds a new version to an existing recipe in the user's cookbook.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user.
   * @param {string} recipeId - The ID of the recipe to add a new version to.
   * @param {any} versionData - The data for the new version to add.
   * @returns {Promise<void>}
   */
  public async addRecipeVersion(
    response: any,
    userId: string,
    recipeId: string,
    versionData: any
  ): Promise<void> {
    try {
      const result = await this.model
        .findOneAndUpdate(
          { user_ID: userId, "modified_recipes._id": recipeId },
          { $push: { "modified_recipes.$.versions": versionData } },
          { new: true }
        )
        .exec();
      response.json(result);
    } catch (error) {
      console.error("Failed to add recipe version:", error);
      response.status(500).json({ error: "Failed to add recipe version" });
    }
  }

  /**
   * Removes a version or the entire recipe.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user.
   * @param {string} recipeId - The ID of the recipe to remove.
   * @param {number} [versionNumber] - The specific version number to remove, if provided.
   * @returns {Promise<void>}
   */
  public async removeRecipeVersion(
    response: any,
    userId: string,
    recipeId: string,
    versionNumber?: number
  ): Promise<void> {
    try {
      const updateQuery = versionNumber
        ? {
            $pull: {
              "modified_recipes.$.versions": { version_number: versionNumber },
            },
          }
        : { $pull: { modified_recipes: { _id: recipeId } } };

      const result = await this.model
        .updateOne({ user_ID: userId }, updateQuery)
        .exec();

      response.json({
        message: versionNumber
          ? `Version ${versionNumber} removed from recipe ${recipeId}`
          : `Recipe ${recipeId} and all versions removed`,
        result,
      });
    } catch (error) {
      console.error("Failed to remove recipe/version:", error);
      response.status(500).json({ error: "Failed to remove recipe/version" });
    }
  }

  /**
   * Retrieves all recipes from a user's cookbook.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user whose cookbook is being retrieved.
   * @returns {Promise<void>}
   */
  public async getAllCookbookRecipes(
    response: any,
    userId: any
  ): Promise<void> {
    try {
      // Find the user's cookbook and populate the `modified_recipes` field
      console.log("get All coookboook recipes");

      // const cookbook = await this.model
      //   .findOne({ user_ID: userId }).modified_recipes
      //   .populate("recipe_versions")
      //   .exec();

      const cookbook = await this.model
        .findOne({ user_ID: userId })
        .populate({
          path: "modified_recipes",
          populate: { path: "recipe_versions" }, // Populate the recipe_versions within modified_recipes
        })
        .exec();

      console.log("cookbook: ", cookbook);

      // If the cookbook doesn't exist, send an empty array
      if (!cookbook) {
        return response.json([]);
      }

      // Return all recipes in the cookbook (could be empty)
      response.json(cookbook.modified_recipes);
    } catch (error) {
      console.error("Failed to retrieve all recipes in the cookbook:", error);
      response.status(500).json({ error: "Failed to retrieve recipes." });
    }
  }
}

export { CookbookModel };
