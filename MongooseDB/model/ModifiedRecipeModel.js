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
exports.ModifiedRecipeModel = void 0;
var mongoose = require("mongoose");
var ModifiedRecipeModel = /** @class */ (function () {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param DB_CONNECTION_STRING - MongoDB connection string.
     */
    function ModifiedRecipeModel(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    /**
     * Creates the Mongoose schema for a modified recipe.
     * Includes fields for user-specific modifications and version control.
     */
    ModifiedRecipeModel.prototype.createSchema = function () {
        var schemaDefinition = {
            user_id: { type: String, required: true },
            original_recipe_id: { type: String, required: true },
            personal_recipe_id: { type: String, unique: true, required: true },
            recipe_id: { type: String, required: true },
            category: [{
                    type: String,
                    enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'vegan', 'gluten-free'],
                    required: true,
                }],
            ingredients: [{
                    name: { type: String, required: true },
                    quantity: { type: Number, required: true },
                    unit: { type: String, enum: ['oz', 'cup', 'tbsp', 'tsp', 'g', 'kg', 'lb', 'each'], required: true }
                }],
            directions: [{
                    step: { type: String, required: true }
                }],
            notes: { type: String },
            version_number: { type: Number, default: 1, required: true },
            image_URL: { type: String },
            cooking_duration: { type: Number, required: true },
            is_Visible: { type: Boolean, default: false }
        };
        this.schema = new mongoose.Schema(schemaDefinition, { collection: 'modifiedRecipes' });
    };
    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     * The model is stored in `this.model`.
     * @returns void
     */
    ModifiedRecipeModel.prototype.createModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })];
                    case 1:
                        _a.sent();
                        this.model = mongoose.model("ModifiedRecipe", this.schema);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds a new modified recipe.
     * @param modifiedRecipe - Object containing modified recipe details.
     * @returns The saved modified recipe document.
     */
    ModifiedRecipeModel.prototype.createModifiedRecipe = function (modifiedRecipe) {
        return __awaiter(this, void 0, void 0, function () {
            var newRecipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newRecipe = new this.model(modifiedRecipe);
                        return [4 /*yield*/, newRecipe.save()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves a modified recipe by `personal_recipe_id`.
     * @param personalRecipeId - The unique ID of the modified recipe.
     * @param response - Response object to send data back to the client.
     */
    ModifiedRecipeModel.prototype.retrieveModifiedRecipe = function (response, personalRecipeId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOne({ personal_recipe_id: personalRecipeId }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2);
                        response.status(500).json({ error: "Failed to retrieve modified recipe" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the ingredients or directions of a modified recipe by `personal_recipe_id`.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param updates - Updated fields for ingredients or directions.
     * @param response - Response object to send updated data.
     */
    ModifiedRecipeModel.prototype.updateModifiedRecipe = function (response, personalRecipeID, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOneAndUpdate({ personal_recipe_id: personalRecipeID }, { $set: updates }, { new: true }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3);
                        response.status(500).json({ error: "Failed to update modified recipe" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes a modified recipe by its `personal_recipe_id`.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param response - Response object to send deletion result.
     */
    ModifiedRecipeModel.prototype.deleteModifiedRecipe = function (response, personalRecipeID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.deleteOne({ personal_recipe_id: personalRecipeID }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json({ message: "Modified recipe ".concat(personalRecipeID, " deleted"), result: result });
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        console.error(e_4);
                        response.status(500).json({ error: "Failed to delete modified recipe" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Saves a new version of the modified recipe.
     * Increments the version number and saves it as a new document.
     * @param modifiedRecipe - Object containing modified recipe details.
     * @returns Saved version of the modified recipe.
     */
    ModifiedRecipeModel.prototype.saveVersion = function (modifiedRecipe) {
        return __awaiter(this, void 0, void 0, function () {
            var newVersion, newRecipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newVersion = __assign(__assign({}, modifiedRecipe), { version_number: modifiedRecipe.version_number + 1 });
                        newRecipe = new this.model(newVersion);
                        return [4 /*yield*/, newRecipe.save()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Adds notes to an existing modified recipe.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param note - The note to add.
     * @param response - Response object to send the updated document.
     */
    ModifiedRecipeModel.prototype.addNotes = function (response, personalRecipeID, note) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOneAndUpdate({ personal_recipe_id: personalRecipeID }, { $set: { notes: note } }, { new: true }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        console.error(e_5);
                        response.status(500).json({ error: "Failed to add notes to modified recipe" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the `category` of a modified recipe by `personal_recipe_id`.
     * @param response - The response object to send data back to the client.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param category - An array of category tags for the recipe.
     * @returns void - Sends the updated recipe in JSON format.
     */
    ModifiedRecipeModel.prototype.updateCategory = function (response, personalRecipeID, category) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOneAndUpdate({ personal_recipe_id: personalRecipeID }, { $set: { category: category } }, { new: true }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_6 = _a.sent();
                        console.error(e_6);
                        response.status(500).json({ error: "Failed to update category" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the `image_URL` of a modified recipe by `personal_recipe_id`.
     * @param response - The response object to send data back to the client.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param imageURL - The new image URL for the recipe.
     * @returns void - Sends the updated recipe in JSON format.
     */
    ModifiedRecipeModel.prototype.updateImageURL = function (response, personalRecipeID, imageURL) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOneAndUpdate({ personal_recipe_id: personalRecipeID }, { $set: { image_URL: imageURL } }, { new: true }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_7 = _a.sent();
                        console.error(e_7);
                        response.status(500).json({ error: "Failed to update image URL" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the `is_Visible` field of a modified recipe by `personal_recipe_id`.
     * @param response - The response object to send data back to the client.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param isVisible - Boolean indicating if the recipe should be visible.
     * @returns void - Sends the updated recipe in JSON format.
     */
    ModifiedRecipeModel.prototype.updateVisibility = function (response, personalRecipeID, isVisible) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOneAndUpdate({ personal_recipe_id: personalRecipeID }, { $set: { is_Visible: isVisible } }, { new: true }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_8 = _a.sent();
                        console.error(e_8);
                        response.status(500).json({ error: "Failed to update visibility" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ModifiedRecipeModel;
}());
exports.ModifiedRecipeModel = ModifiedRecipeModel;
