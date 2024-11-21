import { EnumType } from "typescript";

export interface IRecipe extends Document {
    modified_flag: boolean;
    user_ID: string;
    recipe_ID: string;
    recipe_name: string;
    meal_category: [EnumType];
    recipe_versions: [Object]; // THESE ARE THE RECIPE CONTENTS OBJECTS
    image_url?: string;
    is_visible?: boolean;
  
    // Fields specific to ModifiedRecipeModel
  }
