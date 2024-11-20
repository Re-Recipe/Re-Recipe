// models/ModifiedRecipeModel.ts
import * as mongoose from "mongoose";
import { IContents } from "../interfaces/IContents";

class RecipeContents {
  public schema: mongoose.Schema<IContents>;
  public contents: mongoose.Model<IContents>;

  public constructor() {
    this.createSchema();
  }

  public createSchema() {
    const SchemaDefinition: mongoose.SchemaDefinition<IContents> = {
      version_number: { type: Number, default: 1, required: true },
      cooking_duration: { type: Number, required: true },
      serving_size: { type: Number, required: true },
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

  /**
   * Creates a mongoose model for the modified recipe.
   * This model is used for object validation
   */
  public createModel() {
    this.contents = mongoose.model<IContents>("Contents", this.schema);
  }
}

export { RecipeContents };
