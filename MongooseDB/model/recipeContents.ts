// models/ModifiedRecipeModel.ts
import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";

const recipeSchemaDefinition: mongoose.SchemaDefinition<IRecipe> = {
  version_number: { type: Number, default: 1, required: true },
  cooking_duration: { type: Number, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: {
        type: String,
        enum: ["oz", "cup", "tbsp", "tsp", "g", "kg", "lb", "each"],
        required: true,
      },
    },
  ],
  directions: [
    {
      step: { type: String, required: true },
    },
  ],
  notes: { type: String },
};

export const recipeContentsSchema = new mongoose.Schema<IRecipe>(
  recipeSchemaDefinition
);

/**
 * Utility function to initialize and get the Mongoose model.
 * @param dbConnectionString - MongoDB connection string.
 * @returns The initialized Mongoose model for the modified recipe.
 */
export const getRecipeModel = async (
  dbConnectionString: string
): Promise<mongoose.Model<IRecipe>> => {
  try {
    await mongoose.connect(dbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return mongoose.model<IRecipe>("recipeContents", recipeContentsSchema);
  } catch (e) {
    console.error("Error connecting to MongoDB or initializing model:", e);
    throw e;
  }
};
