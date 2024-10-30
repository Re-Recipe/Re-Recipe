import * as mongoose from "mongoose";

interface IModifiedRecipeModel extends mongoose.Document {
    user_id: string;
    original_recipe_id: string;
    personal_recipe_id: string;
    recipe_id: string;
    category: string[];
    ingredients: {
        name: string;
        quantity: number;
        unit: string;
    }[];
    directions: { step: string }[];
    notes?: string;
    version_number?: number;
    image_URL?: string;
    cooking_duration?: number;
    is_Visible?: boolean;
}

export { IModifiedRecipeModel };

