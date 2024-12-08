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
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser"); // For parsing URL requests and JSON
var DiscoverModel_1 = require("./model/DiscoverModel");
var CookbookModel_1 = require("./model/CookbookModel");
var UserModel_1 = require("./model/UserModel"); // Import the UserModel
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var GooglePassport_1 = require("./GooglePassport");
// TODO: make a data access file
//import {DataAccess} from './DataAccess';
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
        this.googlePassportObj = new GooglePassport_1.default();
        this.expressApp = express();
        this.DiscoverModel = new DiscoverModel_1.DiscoverModel(mongoDBConnection);
        this.Cookbook = new CookbookModel_1.CookbookModel(mongoDBConnection, DiscoverModel_1.DiscoverModel);
        this.UserModel = new UserModel_1.UserModel(mongoDBConnection); // Initialize UserModel
        this.middleware();
        this.routes();
    }
    App.prototype.validateAuth = function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log("User is authenticated");
            return next();
        }
        console.log("User is not authenticated");
        res.status(401).json({ error: "Unauthorized" });
    };
    /**
     * Sets up middleware for the Express application, including
     * body parsing and CORS headers.
     */
    App.prototype.middleware = function () {
        // CORS headers to allow frontend (running on http://localhost:4200) to access the backend
        this.expressApp.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Allow frontend to access
            res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        // Body parsing middleware
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        // Session and cookie parsing middleware
        this.expressApp.use(session({ secret: "1234567890QWERTY", resave: false, saveUninitialized: true }));
        this.expressApp.use(cookieParser());
        // Passport initialization
        this.expressApp.use(passport.initialize());
        this.expressApp.use(passport.session());
    };
    /**
     * Defines the routes/endpoints for the application and associates
     * them with their respective handlers.
     */
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        router.get('/app/auth/check', function (req, res) {
            if (req.isAuthenticated()) {
                return res.json({ loggedIn: true });
            }
            res.json({ loggedIn: false });
        });
        router.get("/app/logout", function (req, res) {
            req.logout(function (err) {
                if (err) {
                    return res.status(500).send("Error logging out.");
                }
                res.redirect("/"); // Redirect to the home page after logout
            });
        });
        /**
         * ========================
         * SECTION: DISCOVER ROUTES
         * ========================
         */
        // Retrieve all recipes in the Discover collection
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
        // Retrieve a specific recipe from the Discover collection by recipeID
        router.get("/app/discover/:recipeID", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var recipeID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipeID = req.params.recipeID;
                        return [4 /*yield*/, this.DiscoverModel.retrieveRecipe(res, recipeID)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Add a new recipe to the Discover collection
        router.post("/app/discover", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var newRecipeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newRecipeData = req.body;
                        return [4 /*yield*/, this.DiscoverModel.createRecipe(res, newRecipeData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Delete a recipe from the Discover collection by recipeID
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
        /**
         * ========================
         * SECTION: COOKBOOK ROUTES
         * ========================
         */
        // Retrieve all recipes in a user's cookbook
        router.get("/app/cookbook/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        return [4 /*yield*/, this.Cookbook.listAllRecipes(res, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Remove a specific recipe from a user's cookbook
        router.delete("/app/cookbook/:userId/recipes/:recipeId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, recipeId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        recipeId = req.params.recipeId;
                        return [4 /*yield*/, this.Cookbook.removeRecipeFromCookbook(res, userId, recipeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Add a new recipe in a user's cookbook
        router.post("/app/cookbook/:userId/recipes/:recipeId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, recipeId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        recipeId = req.params.recipeId;
                        return [4 /*yield*/, this.Cookbook.copyRecipeFromDiscover(res, recipeId, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * ====================
         * SECTION: USER ROUTES
         * ====================
         */
        router.get("/app/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), function (req, res) {
            console.log("User successfully authenticated");
            console.log("Session User:", req.user);
            console.log("user info:" + JSON.stringify(req.user));
            console.log("user info:" + JSON.stringify(req.user.id));
            console.log("user info:" + JSON.stringify(req.user.displayName));
            res.redirect("http://localhost:4200/discover");
        });
        router.get('/app/auth/check', this.validateAuth, function (req, res) {
            if (req.isAuthenticated()) {
                console.log('User is authenticated:', req.user);
                return res.json({ loggedIn: true });
            }
            console.log('User is not authenticated');
            res.json({ loggedIn: false });
        });
        router.get('/app/profile', this.validateAuth, function (req, res) {
            console.log('Query All list');
            console.log("user info:" + JSON.stringify(req.user));
            console.log("user info:" + JSON.stringify(req.user.id));
            console.log("user info:" + JSON.stringify(req.user.displayName));
            res.json({ "username": req.user.displayName, "id": req.user.id });
        });
        // Google SSO Sign - In
        router.get("/app/auth/google", passport.authenticate("google", { scope: ["profile"] }));
        router.get('/app/auth/info', this.validateAuth, function (req, res) {
            console.log('Query All list');
            console.log("user info:" + JSON.stringify(req.user));
            console.log("user info:" + JSON.stringify(req.user.id));
            console.log("user info:" + JSON.stringify(req.user.displayName));
            res.json({ "username": req.user.displayName, "id": req.user.id });
        });
        // Retrieve a user's profile by userId
        router.get("/app/user/profile/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        return [4 /*yield*/, this.UserModel.getUserProfile(res, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Update a user's profile information
        router.put("/app/user/profile/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        updateData = req.body;
                        return [4 /*yield*/, this.UserModel.updateUser(res, userId, updateData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Delete a user's profile by userId
        router.delete("/app/user/profile/:userId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        return [4 /*yield*/, this.UserModel.deleteUser(res, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Mount the router on the Express application
        this.expressApp.use("/", router);
        this.expressApp.use("/app/json/", express.static("".concat(__dirname, "/app/json")));
        this.expressApp.use("/images", express.static("".concat(__dirname, "/img")));
        this.expressApp.use("/", express.static("".concat(__dirname, "/pages")));
        // The static end point for angular and fallback
        this.expressApp.use("/", express.static("".concat(__dirname, "/../recipes/browser")));
        this.expressApp.get("*", function (req, res) {
            res.sendFile("".concat(__dirname, "/../recipes/browser/index.html"));
        });
    };
    return App;
}());
exports.App = App;
