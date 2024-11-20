import { Document } from "mongoose";

export interface IRecipe extends Document {
  modified_flag: boolean;
  user_ID: string;
  recipe_ID: string;
  recipe_name: string;
  category: string[];
  // cooking_duration: number;
  // ingredients: {
  //   ingredient_id?: string;
  //   name: string;
  //   quantity: number;
  //   unit: string;
  // }[];
  // directions: {
  //   step: string;
  // }[];
  recipe_versions: [Object];
  image_url?: string;
  is_visible?: boolean;

  // Fields specific to ModifiedRecipeModel
}
