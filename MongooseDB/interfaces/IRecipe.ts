// interfaces/Recipe.ts
import { Document } from "mongoose";

export interface IRecipe extends Document {
    userID: string;
    recipeID: string;
    recipeName: string;
    category: string[];
    cookingDuration: number;
    ingredients: {
        ingredientId?: string;
        name: string;
        quantity: number;
        unit: string;
    }[];
    directions: {
        step: string;
    }[];
    imageUrl?: string;
    isVisible?: boolean;

    // Fields specific to ModifiedRecipeModel
    personalRecipeID?: string;
    notes?: string;
    versionNumber?: number;
}
