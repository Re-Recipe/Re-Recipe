"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeContentsModel = void 0;
var mongoose = require("mongoose");
var RecipeContents = /** @class */ (function () {
    function RecipeContents() {
        this.createSchema();
        this.createModel();
    }
    RecipeContents.prototype.createSchema = function () {
        var schemaDefinition = {
            user_ID: { type: String, required: true, unique: true },
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
    };
    RecipeContents.prototype.createModel = function () {
        this.contents = mongoose.model("RecipeContents", this.schema, "recipe_contents");
    };
    return RecipeContents;
}());
var RecipeContentsModel = mongoose.model("RecipeContents", new RecipeContents().schema, "recipe_contents");
exports.RecipeContentsModel = RecipeContentsModel;
