"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeContents = void 0;
// models/ModifiedRecipeModel.ts
const mongoose = __importStar(require("mongoose"));
class RecipeContents {
    constructor() {
        this.createSchema();
    }
    createSchema() {
        const SchemaDefinition = {
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
    createModel() {
        this.contents = mongoose.model("Contents", this.schema);
    }
}
exports.RecipeContents = RecipeContents;
//# sourceMappingURL=RecipeContents.js.map