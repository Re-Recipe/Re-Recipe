import Mongoose = require("mongoose");

interface IRecipeModel extends Mongoose.Document {
    recipe_ID: string;
    recipe_name: string;
    category: string[];
    cooking_duration: number;
    ingredients: {
        ingredientId?: string;
        name: string;
        quantity: number;
        unit: string;
    }[];
    directions: {
        step: string
    }[];
    image_URL?: string;
    is_Visible?: boolean;
}

export { IRecipeModel };
