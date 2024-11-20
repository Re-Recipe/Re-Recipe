// models/ModifiedRecipeModel.ts
import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";

class RecipeContents {
  public schema: mongoose.Schema<IRecipe>;
  public model: mongoose.Model<IRecipe>;

  public constructor() {
    this.createSchema();
  }

  public createSchema() {
    const SchemaDefinition: mongoose.SchemaDefinition<IRecipe> = {
      version_number: { type: Number, default: 1, required: true },
      cooking_duration: { type: Number, requiresd: true },
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
  }
}

export { RecipeContents };
