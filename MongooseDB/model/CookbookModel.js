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
exports.CookbookModel = void 0;
var mongoose = require("mongoose");
var CookbookModel = /** @class */ (function () {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param DB_CONNECTION_STRING - MongoDB connection string.
     */
    function CookbookModel(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    /**
     * Defines the schema for a cookbook with a user reference and an array of recipes.
     * Each recipe entry tracks its ID and multiple version numbers independently.
     */
    CookbookModel.prototype.createSchema = function () {
        this.schema = new mongoose.Schema({
            user_id: { type: String, required: true },
            recipes: [
                {
                    recipe_id: { type: String, required: true },
                    versions: [
                        {
                            version_number: { type: Number, required: true },
                            notes: String,
                            last_modified: { type: Date, default: Date.now }
                        }
                    ]
                }
            ]
        }, { collection: "cookbooks" });
    };
    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     * @returns void
     */
    CookbookModel.prototype.createModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })];
                    case 1:
                        _a.sent();
                        this.model = mongoose.model("Cookbook", this.schema);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error creating model:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds a new version of a recipe to the user's cookbook.
     * @param userId - ID of the user.
     * @param recipeId - ID of the recipe.
     * @param versionData - Metadata for the new version.
     * @param response - The response object to send data back to the client.
     */
    CookbookModel.prototype.addRecipeVersion = function (response, userId, recipeId, versionData) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOneAndUpdate({ user_id: userId, "recipes.recipe_id": recipeId }, { $push: { "recipes.$.versions": versionData } }, { new: true, upsert: true }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Failed to add recipe version:", error_2);
                        response.status(500).json({ error: "Failed to add recipe version" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves specific or all versions of a recipe by `recipe_id`.
     * @param userId - ID of the user.
     * @param recipeId - The ID of the recipe.
     * @param versionNumber - (Optional) The specific version number to retrieve.
     * @param response - The response object to send data back to the client.
     */
    CookbookModel.prototype.retrieveRecipeVersion = function (response, userId, recipeId, versionNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var cookbook, recipe, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOne({ user_id: userId, "recipes.recipe_id": recipeId }).exec()];
                    case 1:
                        cookbook = _a.sent();
                        recipe = cookbook === null || cookbook === void 0 ? void 0 : cookbook.recipes.find(function (r) { return r.recipe_id === recipeId; });
                        if (recipe) {
                            result = versionNumber
                                ? recipe.versions.find(function (v) { return v.version_number === versionNumber; })
                                : recipe.versions;
                            response.json(result);
                        }
                        else {
                            response.status(404).json({ error: "Recipe not found" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Failed to retrieve recipe version:", error_3);
                        response.status(500).json({ error: "Failed to retrieve recipe version" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a recipe or a specific version of a recipe.
     * @param userId - ID of the user.
     * @param recipeId - The ID of the recipe.
     * @param versionNumber - (Optional) Version number to remove.
     * @param response - The response object to send data back to the client.
     */
    CookbookModel.prototype.removeRecipeVersion = function (response, userId, recipeId, versionNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var result, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!versionNumber) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.model.updateOne({ user_id: userId, "recipes.recipe_id": recipeId }, { $pull: { "recipes.$.versions": { version_number: versionNumber } } }).exec()];
                    case 1:
                        result = _a.sent();
                        response.json({ message: "Version ".concat(versionNumber, " removed from recipe ").concat(recipeId), result: result });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.model.updateOne({ user_id: userId }, { $pull: { recipes: { recipe_id: recipeId } } }).exec()];
                    case 3:
                        result = _a.sent();
                        response.json({ message: "Recipe ".concat(recipeId, " and all versions removed"), result: result });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        console.error("Failed to remove recipe/version:", error_4);
                        response.status(500).json({ error: "Failed to remove recipe/version" });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Compares two versions of a recipe by version number.
     * @param userId - ID of the user.
     * @param recipeId - The ID of the recipe.
     * @param version1 - The first version number to compare.
     * @param version2 - The second version number to compare.
     * @param response - The response object to send data back to the client.
     */
    CookbookModel.prototype.compareRecipeVersions = function (response, userId, recipeId, version1, version2) {
        return __awaiter(this, void 0, void 0, function () {
            var cookbook, recipe, ver1, ver2, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOne({ user_id: userId, "recipes.recipe_id": recipeId }).exec()];
                    case 1:
                        cookbook = _a.sent();
                        recipe = cookbook === null || cookbook === void 0 ? void 0 : cookbook.recipes.find(function (r) { return r.recipe_id === recipeId; });
                        if (recipe) {
                            ver1 = recipe.versions.find(function (v) { return v.version_number === version1; });
                            ver2 = recipe.versions.find(function (v) { return v.version_number === version2; });
                            if (ver1 && ver2) {
                                response.json({ version1: ver1, version2: ver2 });
                            }
                            else {
                                response.status(404).json({ error: "One or both versions not found" });
                            }
                        }
                        else {
                            response.status(404).json({ error: "Recipe not found" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Failed to compare recipe versions:", error_5);
                        response.status(500).json({ error: "Failed to compare recipe versions" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Lists all recipes in the user's cookbook.
     * @param userId - ID of the user.
     * @param response - The response object to send data back to the client.
     */
    CookbookModel.prototype.listAllRecipes = function (response, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var cookbook, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOne({ user_id: userId }, { recipes: { recipe_id: 1 } }).exec()];
                    case 1:
                        cookbook = _a.sent();
                        response.json(cookbook ? cookbook.recipes : []);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Failed to list recipes:", error_6);
                        response.status(500).json({ error: "Failed to list recipes" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CookbookModel;
}());
exports.CookbookModel = CookbookModel;
