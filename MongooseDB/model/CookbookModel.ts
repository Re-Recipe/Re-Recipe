import * as mongoose from "mongoose";
import { ModifiedRecipeModel } from "./ModifiedRecipeModel";
import { IRecipe } from "../interfaces/IRecipe";

class CookbookModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<any>;
  public dbConnectionString: string;
  private modifiedRecipeModel: ModifiedRecipeModel;

  /**
   * Constructor to initialize the database connection and set up the schema and model.
   * @param DB_CONNECTION_STRING - MongoDB connection string.
   */
  public constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.createSchema();
    this.createModel();
    this.modifiedRecipeModel = new ModifiedRecipeModel();
  }

  /**
   * Defines the schema for a cookbook with a user reference and arrays for modified and saved recipes.
   */
  public createSchema() {
    this.schema = new mongoose.Schema(
      {
        user_ID: { type: String, required: true, unique: true },
        title: { type: String, default: "My Cookbook" }, // Optional user title
        modified_recipes: [
          { type: mongoose.Schema.Types.ObjectId, ref: "ModifiedRecipe" },
        ],
        // saved_recipes: [ DONT NEED BC MOD RECIPES HAVE THE ID OF THE OG RECIPE
        //   { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }
        // ],
      },
      { collection: "cookbooks" }
    );
  }

  /**
   * Connects to the MongoDB database and creates the Mongoose model based on the schema.
   * @returns void
   */
  public async createModel() {
    try {
      await mongoose.connect(this.dbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.model = mongoose.model("Cookbook", this.schema);
      console.log("Connected to MongoDB and created Cookbook model.");
    } catch (error) {
      console.error("Error creating model:", error);
    }
  }

  /**
   * ======================================================
   * TODO: CHANGE METHODS BELOW TO REFLECT UPDATED SCHEMA!!
   * ======================================================
   */

  // TODO: should add a new cookbook entry for the user? so 2 references
  //       1. OG recipe
  //       2. Modified recipe entry

  /**
   * Save recipe:
   * 1. make a modified recipe (object) out of a recipe
   * 2. add modified recipe (obj) to cookbook recipe list
   * (do we need to check if the recipe is already in the cookbook?)
   */
  public async saveRecipeAsModified(
    response: any,
    recipe: IRecipe,
    user_ID: string
  ) {
    try {
      // validate inputs todo?

      // 1. Create new ModifiedRecipeModel with new recipe data
      // TODO: THIS IS NOT CORRECT
      const modifiedRecipeData = this.modifiedRecipeModel.createModRecipe(
        newRecipeData,
        userID
      );

      // 2.  Look for cookbook: save recipe
      const cookbook = await this.model.findOne({ user_ID }).exec();
      if (!cookbook) {
        return response.status(404).json({ error: "Cookbook not found" });
      }

      // Push the changes to the cookbook
      cookbook.modified_recipes.push(modifiedRecipeData);
      const updatedCookbook = await cookbook.save();
      response.status(201).json(updatedCookbook);
    } catch (error) {
      // If for some reason save fails:
      console.error("Failed to save modified recipe:", error);
      response.status(500).json({ error: "Failed to save modified recipe" });
    }
  }

  // Deleting a modified recipes with the recipe ID  and user ID
  /**
   * Removes a recipe from the cookbook
   * @param userId - ID of the user.
   * @param recipeId - The ID of the recipe.
   * @param response - The response object to send data back to the client.
   */
  public async removeRecipeFromCookbook(
    response: any,
    userId: string,
    recipeId: string
  ) {
    try {
      // Remove entire recipe entry
      const result = await this.modifiedRecipeModel.model
        .deleteOne({ user_ID: userId, recipe_ID: recipeId })
        .exec();

      if (result.deletedCount > 0) {
        response.json({
          message: `Modified recipe with ID ${recipeId} deleted successfully.`,
          result,
        });
      } else {
        response.status(404).json({ error: "Modified Recipe Not Found" });

        response.json({
          message: `Recipe ${recipeId} and all versions removed`,
          result,
        });
      }
    } catch (error) {
      console.error("Failed to remove recipe from the cookbook:", error);
      response.status(500).json({ error: "Failed to remove recipe/version" });
    }
  }

  /**
   * Lists all recipes in the user's cookbook.
   * @param userId - ID of the user.
   * @param response - The response object to send data back to the client.
   */
  public async listAllRecipes(response: any, userId: string) {
    try {
      const cookbook = await this.model
        .findOne(
          { user_id: userId },
          { recipes: 1 } // Ensure you are selecting the full `recipes` field
        )
        .exec();
      response.json(cookbook ? cookbook.recipes : []);
    } catch (error) {
      console.error("Failed to list recipes:", error);
      response.status(500).json({ error: "Failed to list recipes" });
    }
  }

  /**
   * Adds a new version of a recipe to the modified recipe in cookbook DB
   * @param userId - ID of the user.
   * @param recipeId - ID of the recipe.
   * @param versionData - Metadata for the new version.
   * @param response - The response object to send data back to the client.
   */
  public async addRecipeVersion(
    response: any,
    userId: string,
    recipeId: string,
    versionData: any
  ) {
    try {
      const result = await this.model
        .findOneAndUpdate(
          { user_id: userId, "recipes.recipe_id": recipeId },
          { $push: { "recipes.$.versions": versionData } },
          { new: true, upsert: true }
        )
        .exec();
      response.json(result);
    } catch (error) {
      console.error("Failed to add recipe version:", error);
      response.status(500).json({ error: "Failed to add recipe version" });
    }

    //*************************************** */
  }

  //

  /**
   * Retrieves specific or all versions of a recipe by `recipe_id`.
   * @param userId - ID of the user.
   * @param recipeId - The ID of the recipe.
   * @param versionNumber - (Optional) The specific version number to retrieve.
   * @param response - The response object to send data back to the client.
   */
  public async retrieveRecipeVersion(
    response: any,
    userId: string,
    recipeId: string,
    versionNumber?: number
  ) {
    try {
      const cookbook = await this.model
        .findOne({ user_id: userId, "recipes.recipe_id": recipeId })
        .exec();
      const recipe = cookbook?.recipes.find(
        (r: any) => r.recipe_id === recipeId
      );

      if (recipe) {
        const result = versionNumber
          ? recipe.versions.find((v: any) => v.version_number === versionNumber)
          : recipe.versions;
        response.json(result);
      } else {
        response.status(404).json({ error: "Recipe not found" });
      }
    } catch (error) {
      console.error("Failed to retrieve recipe version:", error);
      response.status(500).json({ error: "Failed to retrieve recipe version" });
    }
  }

  /**
   * Removes a recipe or a specific version of a recipe.
   * @param userId - ID of the user.
   * @param recipeId - The ID of the recipe.
   * @param versionNumber - (Optional) Version number to remove.
   * @param response - The response object to send data back to the client.
   */
  public async removeRecipeVersion(
    response: any,
    userId: string,
    recipeId: string,
    versionNumber?: number
  ) {
    try {
      if (versionNumber) {
        // Remove specific version
        const result = await this.model
          .updateOne(
            { user_id: userId, "recipes.recipe_id": recipeId },
            {
              $pull: {
                "recipes.$.versions": { version_number: versionNumber },
              },
            }
          )
          .exec();
        response.json({
          message: `Version ${versionNumber} removed from recipe ${recipeId}`,
          result,
        });
      } else {
        // Remove entire recipe entry
        const result = await this.model
          .updateOne(
            { user_id: userId },
            { $pull: { recipes: { recipe_id: recipeId } } }
          )
          .exec();
        response.json({
          message: `Recipe ${recipeId} and all versions removed`,
          result,
        });
      }
    } catch (error) {
      console.error("Failed to remove recipe/version:", error);
      response.status(500).json({ error: "Failed to remove recipe/version" });
    }
  }

  /**
   * Compares two versions of a recipe by version number.
   * @param userId - ID of the user.
   * @param recipeId - The ID of the recipe.
   * @param version1 - The first version number to compare.
   * @param version2 - The second version number to compare.
   * @param response - The response object to send data back to the client.
   */
  public async compareRecipeVersions(
    response: any,
    userId: string,
    recipeId: string,
    version1: number,
    version2: number
  ) {
    try {
      const cookbook = await this.model
        .findOne({ user_id: userId, "recipes.recipe_id": recipeId })
        .exec();
      const recipe = cookbook?.recipes.find(
        (r: any) => r.recipe_id === recipeId
      );

      if (recipe) {
        const ver1 = recipe.versions.find(
          (v: any) => v.version_number === version1
        );
        const ver2 = recipe.versions.find(
          (v: any) => v.version_number === version2
        );

        if (ver1 && ver2) {
          response.json({ version1: ver1, version2: ver2 });
        } else {
          response
            .status(404)
            .json({ error: "One or both versions not found" });
        }
      } else {
        response.status(404).json({ error: "Recipe not found" });
      }
    } catch (error) {
      console.error("Failed to compare recipe versions:", error);
      response.status(500).json({ error: "Failed to compare recipe versions" });
    }
  }

  /**
   * Lists all recipes in the user's cookbook.
   * @param userId - ID of the user.
   * @param response - The response object to send data back to the client.
   */
  // public async listAllRecipes(response: any, userId: string) {
  //     try {
  //         const cookbook = await this.model.findOne(
  //             { user_id: userId },
  //             { recipes: 1 } // Ensure you are selecting the full `recipes` field
  //         ).exec();
  //         response.json(cookbook ? cookbook.recipes : []);
  //     } catch (error) {
  //         console.error("Failed to list recipes:", error);
  //         response.status(500).json({ error: "Failed to list recipes" });
  //     }
  // }

  /**
   * Adds one or many new recipes to the user's cookbook.
   * @param response - The response object to send data back to the client.
   * @param userId - ID of the user.
   * @param newRecipes - An array of new recipe objects to be added.
   *
   */
  public async addManyNewRecipes(
    response: any,
    userId: string,
    newRecipes: any[]
  ) {
    try {
      // Check if the user's cookbook already exists
      let cookbook = await this.model.findOne({ user_id: userId }).exec();

      if (cookbook) {
        // Add each new recipe to the existing cookbook
        newRecipes.forEach((recipe) => {
          const existingRecipe = cookbook.recipes.find(
            (r: any) => r.recipe_id === recipe.recipe_id
          );
          if (!existingRecipe) {
            cookbook.recipes.push(recipe);
          }
        });
      } else {
        // If the cookbook does not exist, create a new one
        cookbook = new this.model({
          user_id: userId,
          recipes: newRecipes, // Add all new recipes at once
        });
      }

      // Save the updated or new cookbook
      const result = await cookbook.save();
      response.json({
        message: "Recipes added successfully",
        cookbook: result,
      });
    } catch (error) {
      console.error("Failed to add new recipes:", error);
      response.status(500).json({ error: "Failed to add new recipes" });
    }
  }
}

export { CookbookModel };
