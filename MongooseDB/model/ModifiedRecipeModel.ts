// models/ModifiedRecipeModel.ts
import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";
import { RecipeContents } from "./recipeContents";

// TODO
//import { IMealCategory } from "../interfaces/IMealCategory";

class ModifiedRecipeModel {
  public schema: mongoose.Schema<IRecipe>;
  public model: mongoose.Model<IRecipe>;

  /**
   * Constructor to initialize the database connection and set up the schema and model.
   */
  public constructor() {
    this.createSchema();
  }

  /**
   * Creates the Mongoose schema for a modified recipe.
   * Includes fields for user-specific modifications and version control.
   */
  public createSchema() {
    const schemaDefinition: mongoose.SchemaDefinition<IRecipe> = {
      recipe_ID: { type: String, required: true }, // ID of the original recipe
      recipe_name: { type: String, required: true },
      // meal_category: [
      //   {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: "MealCategory",
      //     required: true,
      //   },
      // ],
      recipe_versions: [
        { type: mongoose.Schema.Types.ObjectId, ref: "RecipeContents" },
      ], // this is recipe_contents
      image_url: { type: String },
      is_visible: { type: Boolean, default: false },
    };

    this.schema = new mongoose.Schema(schemaDefinition, {
      collection: "modifiedRecipes",
    });
  }

  /**
   * Creates a mongoose model for the modified recipe.
   * This model is used for object validation
   */
  public createModel() {
    this.model = mongoose.model<IRecipe>("ModifiedREcipe", this.schema);
  }

  /**
   * Method to create a modified recipe and add it to the user's cookbook.
   * @param cookbookModel - The Cookbook model instance to update.
   * @param userId - The ID of the user.
   * @param newRecipeData - The new recipe data from the user.
   */
  public addModifiedRecipeObject(newRecipeData: IRecipe, userID: string) {
    return new this.model({
      ...newRecipeData,
      user_ID: userID,
      is_visible: false,
    });
  }
}

export { ModifiedRecipeModel };
