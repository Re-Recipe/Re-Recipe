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
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser"); // for parsing url requests and json
var RecipeModel_1 = require("./model/RecipeModel");
var ModifiedRecipeModel_1 = require("./model/ModifiedRecipeModel");
var CookbookModel_1 = require("./model/CookbookModel");
var crypto = require("crypto"); // import crypto library for unique ID generation
/**
 * The main application class that sets up the Express server (main server to handle HTTP requests),
 * middleware, routes, and database models.
 */
var App = /** @class */ (function () {
    /**
     * Creates an instance of the App.
     *
     * @param {string} mongoDBConnection - The MongoDB connection string.
     */
    function App(mongoDBConnection) {
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.RecipeList = new RecipeModel_1.RecipeModel(mongoDBConnection);
        this.ModifiedRecipes = new ModifiedRecipeModel_1.ModifiedRecipeModel(mongoDBConnection);
        this.Cookbook = new CookbookModel_1.CookbookModel(mongoDBConnection);
    }
    /**
     * Sets up middleware for the Express application, including
     * body parsing and CORS headers.
     * CORS - security feature implemented by web browsers to control how resources on one domain
     * can be requested by a web page from a different domain
     *
     * @private
     * @returns {void}
     */
    App.prototype.middleware = function () {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    };
    /**
     * Defines the routes/endpoints for the application and associates
     * them with their respective handlers.
     *
     * @private
     * @returns {void}
     */
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        /**
         * GET /app/recipes
         * Retrieves all recipes.
         *
         * @route GET /app/recipes
         * @param {express.Request} req - The request object.
         * @param {express.Response} res - The response object.
         * @returns {Promise<void>} - Resolves when the response is sent.
         */
        router.get('/app/recipes', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.RecipeList.retrieveAllRecipes(res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * GET /app/recipes/:recipeID
         * Retrieves a specific recipe by its ID.
         *
         * @route GET /app/recipes/:recipeID
         * @param {express.Request} req - The request object.
         * @param {express.Response} res - The response object.
         * @returns {Promise<void>} - Resolves when the response is sent.
         */
        router.get('/app/recipes/:recipeID', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var recipeID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipeID = req.params.recipeID;
                        console.log('Query recipe list with id:', recipeID);
                        return [4 /*yield*/, this.RecipeList.retrieveRecipe(res, recipeID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * POST /app/recipes
         * Adds a new recipe.
         *
         * @route POST /app/recipes
         * @param {express.Request} req - The request object containing the recipe data.
         * @param {express.Response} res - The response object.
         * @returns {Promise<void>} - Resolves when the response is sent.
         */
        router.post('/app/recipes', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, jsonObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = crypto.randomBytes(16).toString("hex");
                        jsonObj = __assign(__assign({}, req.body), { recipe_ID: id });
                        return [4 /*yield*/, this.RecipeList.model.create(jsonObj)];
                    case 1:
                        _a.sent();
                        res.status(201).json({ id: id });
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * PUT /app/recipes/:recipeID/directions
         * Updates the directions of a specific recipe.
         *
         * @route PUT /app/recipes/:recipeID/directions
         * @param {express.Request} req - The request object containing the updated directions.
         * @param {express.Response} res - The response object.
         * @returns {Promise<void>} - Resolves when the response is sent.
         */
        router.put('/app/recipes/:recipeID/directions', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var recipeID, directions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipeID = req.params.recipeID;
                        directions = req.body.directions;
                        if (!Array.isArray(directions)) {
                            res.status(400).json({ error: "Directions must be an array." });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.RecipeList.updateDirections(res, recipeID, directions)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * PUT /app/recipes/:recipeID/directions/:stepIndex
         * Updates a specific step in the directions of a recipe.
         *
         * @route PUT /app/recipes/:recipeID/directions/:stepIndex
         * @param {express.Request} req - The request object containing the new step.
         * @param {express.Response} res - The response object.
         * @returns {Promise<void>} - Resolves when the response is sent.
         */
        router.put('/app/recipes/:recipeID/directions/:stepIndex', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var recipeID, stepIndex, newStep;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipeID = req.params.recipeID;
                        stepIndex = parseInt(req.params.stepIndex, 10);
                        newStep = req.body.newStep;
                        if (isNaN(stepIndex) || stepIndex < 0) {
                            res.status(400).json({ error: "Invalid step index." });
                            return [2 /*return*/];
                        }
                        if (typeof newStep !== 'string' || newStep.trim() === '') {
                            res.status(400).json({ error: "New step must be a non-empty string." });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.RecipeList.updateDirectionStep(res, recipeID, stepIndex, newStep)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * PUT /app/recipes/:recipeID/ingredients
         * Updates the ingredients of a specific recipe.
         *
         * @route PUT /app/recipes/:recipeID/ingredients
         * @param {express.Request} req - The request object containing the updated ingredients.
         * @param {express.Response} res - The response object.
         * @returns {Promise<void>} - Resolves when the response is sent.
         */
        router.put('/app/recipes/:recipeID/ingredients', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var recipeID, ingredients;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipeID = req.params.recipeID;
                        ingredients = req.body.ingredients;
                        return [4 /*yield*/, this.RecipeList.updateIngredients(res, recipeID, ingredients)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * DELETE /app/recipes/:recipeID
         * Deletes a recipe by its ID.
         *
         * @route DELETE /app/recipes/:recipeID
         * @param {express.Request} req - The request object.
         * @param {express.Response} res - The response object.
         * @returns {Promise<void>} - Resolves when the response is sent.
         */
        router.delete('/app/recipes/:recipeID', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var recipeID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipeID = req.params.recipeID;
                        return [4 /*yield*/, this.RecipeList.deleteRecipe(res, recipeID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Mount the router on the Express application
        this.expressApp.use('/', router);
        this.expressApp.use('/app/json/', express.static("".concat(__dirname, "/app/json")));
        this.expressApp.use('/images', express.static("".concat(__dirname, "/img")));
        this.expressApp.use('/', express.static("".concat(__dirname, "/pages")));
    };
    return App;
}());
exports.App = App;
