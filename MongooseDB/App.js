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
var bodyParser = require("body-parser"); // for parsing URL requests and JSON
var DiscoverModel_1 = require("./model/DiscoverModel");
var CookbookModel_1 = require("./model/CookbookModel");
var crypto = require("crypto"); // for unique ID generation
/**
 * The main application class that sets up the Express server,
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
        this.DiscoverModel = new DiscoverModel_1.DiscoverModel(mongoDBConnection);
        this.Cookbook = new CookbookModel_1.CookbookModel(mongoDBConnection, DiscoverModel_1.DiscoverModel);
        this.middleware();
        this.routes();
    }
    /**
     * Sets up middleware for the Express application, including
     * body parsing and CORS headers.
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
     */
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        // Recipe CRUD Routes
        router.get("/app/discover", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.DiscoverModel.retrieveAllRecipes(res)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        router.get("/app/discover/:recipeID", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var recipeID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipeID = req.params.recipeID;
                        console.log("Query recipe list with id:", recipeID);
                        return [4 /*yield*/, this.DiscoverModel.retrieveRecipe(res, recipeID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        router.post("/app/discover", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, jsonObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = crypto.randomBytes(16).toString("hex");
                        jsonObj = __assign(__assign({}, req.body), { recipe_ID: id });
                        return [4 /*yield*/, this.DiscoverModel.model.create(jsonObj)];
                    case 1:
                        _a.sent();
                        res.status(201).json({ id: id });
                        return [2 /*return*/];
                }
            });
        }); });
        router.delete("/app/discover/:recipeID", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var recipeID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipeID = req.params.recipeID;
                        return [4 /*yield*/, this.DiscoverModel.deleteRecipe(res, recipeID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Cookbook Routes
        // Retrieve all recipes in a user's cookbook
        router.get("/app/cookbook/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // Fetch the user's cookbook
                        return [4 /*yield*/, this.Cookbook.listAllRecipes(res, userId)];
                    case 2:
                        // Fetch the user's cookbook
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Failed to fetch cookbook:", error_1);
                        res.status(500).json({ error: "Failed to fetch cookbook data" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Delete a specific recipe from a user's cookbook
        router.delete("/app/cookbook/:userId/recipes/:recipeId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, recipeId, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        recipeId = req.params.recipeId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.Cookbook.removeRecipeFromCookbook(res, userId, recipeId)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Failed to delete recipe:", error_2);
                        res
                            .status(500)
                            .json({ error: "Failed to delete recipe from cookbook" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Add a new version to a recipe in a user's cookbook
        router.post("/app/cookbook/:userId/recipes/:recipeId/versions", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, recipeId, versionData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        recipeId = req.params.recipeId;
                        versionData = req.body.versionData;
                        if (!versionData || typeof versionData !== "object") {
                            res
                                .status(400)
                                .json({ error: "Version data must be a valid object." });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.Cookbook.addRecipeVersion(res, userId, recipeId, versionData)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Failed to add recipe version:", error_3);
                        res.status(500).json({ error: "Failed to add recipe version" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Retrieve all recipes in a user's cookbook
        router.get("/app/cookbook/:userId/recipes", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // Call the listAllRecipes method from CookbookModel
                        return [4 /*yield*/, this.Cookbook.listAllRecipes(res, userId)];
                    case 2:
                        // Call the listAllRecipes method from CookbookModel
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Failed to fetch recipes:", error_4);
                        res.status(500).json({ error: "Failed to fetch recipes" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Mount the router on the Express application
        this.expressApp.use("/", router);
        this.expressApp.use("/app/json/", express.static("".concat(__dirname, "/app/json")));
        this.expressApp.use("/images", express.static("".concat(__dirname, "/img")));
        this.expressApp.use("/", express.static("".concat(__dirname, "/pages")));
    };
    return App;
}());
exports.App = App;
