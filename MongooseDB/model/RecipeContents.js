"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeContents = exports.recipeContentsInstance = void 0;
// models/ModifiedRecipeModel.ts
const mongoose = require("mongoose");
class RecipeContents {
    constructor() {
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        const schemaDefinition = {
            recipe_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
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
        this.schema = new mongoose.Schema(schemaDefinition);
    }
    /**
     * Creates a mongoose model for the modified recipe.
     * This model is used for object validation
     */
    createModel() {
        this.contents = mongoose.model("Contents", this.schema);
    }
}
exports.RecipeContents = RecipeContents;
// export { RecipeContents };
const recipeContentsInstance = new RecipeContents();
exports.recipeContentsInstance = recipeContentsInstance;
//# sourceMappingURL=RecipeContents.js.map