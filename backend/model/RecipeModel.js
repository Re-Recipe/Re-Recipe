"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeModel = void 0;
var mongoose = require("mongoose");
var RecipeContents_1 = require("./RecipeContents");
var RecipeModel = /** @class */ (function () {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     */
    function RecipeModel() {
        this.createSchema();
        this.createModel();
    }
    /**
     * Creates the Mongoose schema for a  recipe.
     * Includes fields for user-specific modifications and version control.
     */
    RecipeModel.prototype.createSchema = function () {
        var schemaDefinition = {
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
    };
    /**
     * Creates a mongoose model for the modified recipe.
     * This model is used for object validation
     */
    RecipeModel.prototype.createModel = function () {
        this.recipe =
            mongoose.models.Recipe || mongoose.model("Recipe", this.schema);
    };
    /**
     * TODO
     * Creates a new recipe. To set modified recipe: set param flag to true
     * @param
     * @param
     * @param
     * @param
     */
    RecipeModel.prototype.createRecipe = function (recipeData_1) {
        return __awaiter(this, arguments, void 0, function (recipeData, isModified) {
            var newRecipe;
            if (isModified === void 0) { isModified = false; }
            return __generator(this, function (_a) {
                newRecipe = new this.recipe(__assign(__assign({}, recipeData), { modified_flag: isModified }));
                return [2 /*return*/, newRecipe];
            });
        });
    };
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
    RecipeModel.prototype.createRecipeVersion = function (recipe, recipe_contents_data) {
        var new_version_number = recipe.recipe_versions.length;
        var newRecipeContents = new RecipeContents_1.recipeContentsInstance.contents(__assign(__assign({}, recipe_contents_data), { version_number: new_version_number }));
        recipe.recipe_versions.push(newRecipeContents);
        return recipe;
    };
    return RecipeModel;
}());
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
