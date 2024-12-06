import { Types, Document } from "mongoose";

export interface IRecipeContents extends Document {
  recipe_ID: Types.ObjectId; 
  cooking_duration: number;
  version_number: number;
  serving_size: number;
  ingredients: {
    ingredient_id?: string;
    name: string;
    unit: string;
    quantity: Number,
  }[];
  directions: {
    step: string;
  }[];
  notes?: string;
}
