"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeModel = void 0;
const mongoose = require("mongoose");
const RecipeContents_1 = require("./RecipeContents");
class RecipeModel {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     */
    constructor() {
        this.createSchema();
        this.createModel();
    }
    /**
     * Creates the Mongoose schema for a  recipe.
     * Includes fields for user-specific modifications and version control.
     */
    createSchema() {
        const schemaDefinition = {
            modified_flag: Boolean,
            recipe_ID: { type: String, required: true }, // ID of the original recipe
            recipe_name: { type: String, required: true },
            meal_category: {
                enum: [
                    "breakfast",
                    "lunch",
                    "dinner",
                    "dessert",
                    "vegetarian",
                    "vegan",
                    "gluten-free",
                ],
            },
            recipe_versions: [
                { type: mongoose.Schema.Types.ObjectId, ref: "RecipeContents" },
            ], // this is recipe_contents
            image_url: { type: String },
            is_visible: { type: Boolean, default: false },
        };
        this.schema = new mongoose.Schema(schemaDefinition);
    }
    /**
     * Creates a mongoose model for the modified recipe.
     * This model is used for object validation
     */
    createModel() {
        this.recipe =
            mongoose.models.Recipe || mongoose.model("Recipe", this.schema);
    }
    /**
     * TODO
     * Creates a new recipe. To set modified recipe: set param flag to true
     * @param
     * @param
     * @param
     * @param
     */
    createRecipe(recipeData_1) {
        return __awaiter(this, arguments, void 0, function* (recipeData, isModified = false) {
            const newRecipe = new this.recipe(Object.assign(Object.assign({}, recipeData), { modified_flag: isModified }));
            return newRecipe;
        });
    }
    // Update?
    // Delete?
    /**
     * PRE:CONDITION : needs to have correct recipe_contents_data
     * Fetch modified recipe
     * create new recipe contents obj
     * add it to the recipe version list
     * return it back
     * @param recipe
     * @param recipe_contents_data
     */
    createRecipeVersion(recipe, recipe_contents_data) {
        const new_version_number = recipe.recipe_versions.length;
        const newRecipeContents = new RecipeContents_1.recipeContentsInstance.contents(Object.assign(Object.assign({}, recipe_contents_data), { version_number: new_version_number }));
        recipe.recipe_versions.push(newRecipeContents);
        return recipe;
    }
}
exports.RecipeModel = RecipeModel;
// /**
//  * Create A Modified Recipe for the cookbook
//  */
// public createModifiedRecipe(recipe_data: IRecipe, user_ID) {
//   // copy recipe data
//   const newModRecipe = new this.recipe({
//     userID: user_ID,
//     ...recipe_data,
//     modified_flag: true,
//   });
//   return newModRecipe;
// }
//# sourceMappingURL=RecipeModel.js.map