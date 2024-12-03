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
exports.App = void 0;
const express = require("express");
const bodyParser = require("body-parser"); // For parsing URL requests and JSON
const DiscoverModel_1 = require("./model/DiscoverModel");
const CookbookModel_1 = require("./model/CookbookModel");
const UserModel_1 = require("./model/UserModel"); // Import the UserModel
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
// TODO: make a data access file
//import {DataAccess} from './DataAccess';
/**
 * The main application class that sets up the Express server,
 * middleware, routes, and database models.
 */
class App {
    /**
     * Creates an instance of the App.
     *
     * @param {string} mongoDBConnection - The MongoDB connection string.
     */
    constructor(mongoDBConnection) {
        this.expressApp = express();
        this.DiscoverModel = new DiscoverModel_1.DiscoverModel(mongoDBConnection);
        this.Cookbook = new CookbookModel_1.CookbookModel(mongoDBConnection, DiscoverModel_1.DiscoverModel);
        this.UserModel = new UserModel_1.UserModel(mongoDBConnection); // Initialize UserModel
        this.middleware();
        this.routes();
    }
    /**
     * Sets up middleware for the Express application, including
     * body parsing and CORS headers.
     */
    middleware() {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        this.expressApp.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.expressApp.use(session({ secret: 'keyboard cat' }));
        this.expressApp.use(cookieParser());
        this.expressApp.use(passport.initialize());
        this.expressApp.use(passport.session());
    }
    /**
     * Defines the routes/endpoints for the application and associates
     * them with their respective handlers.
     */
    routes() {
        const router = express.Router();
        /**
         * ========================
         * SECTION: DISCOVER ROUTES
         * ========================
         */
        // Retrieve all recipes in the Discover collection
        router.get("/app/discover", (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.DiscoverModel.retrieveAllRecipes(res);
        }));
        // Retrieve a specific recipe from the Discover collection by recipeID
        router.get("/app/discover/:recipeID", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const recipeID = req.params.recipeID;
            yield this.DiscoverModel.retrieveRecipe(res, recipeID);
        }));
        // Add a new recipe to the Discover collection
        router.post("/app/discover", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newRecipeData = req.body;
            yield this.DiscoverModel.createRecipe(res, newRecipeData);
        }));
        // Delete a recipe from the Discover collection by recipeID
        router.delete("/app/discover/:recipeID", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const recipeID = req.params.recipeID;
            yield this.DiscoverModel.deleteRecipe(res, recipeID);
        }));
        /**
         * ========================
         * SECTION: COOKBOOK ROUTES
         * ========================
         */
        // Retrieve all recipes in a user's cookbook
        router.get("/app/cookbook/:userId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            yield this.Cookbook.listAllRecipes(res, userId);
        }));
        // Remove a specific recipe from a user's cookbook
        router.delete("/app/cookbook/:userId/recipes/:recipeId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const recipeId = req.params.recipeId;
            yield this.Cookbook.removeRecipeFromCookbook(res, userId, recipeId);
        }));
        // Add a new version to a recipe in a user's cookbook
        router.post("/app/cookbook/:userId/recipes/:recipeId/versions", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const recipeId = req.params.recipeId;
            const versionData = req.body.versionData;
            yield this.Cookbook.addRecipeVersion(res, userId, recipeId, versionData);
        }));
        /**
         * ====================
         * SECTION: USER ROUTES
         * ====================
         */
        // Create a new user account
        router.post("/app/user/signup", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userData = req.body;
            yield this.UserModel.signup(res, userData);
        }));
        // Log in an existing user
        router.post("/app/user/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            yield this.UserModel.login(res, username, password);
        }));
        // Retrieve a user's profile by userId
        router.get("/app/user/profile/:userId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            yield this.UserModel.getUserProfile(res, userId);
        }));
        // Update a user's profile information
        router.put("/app/user/profile/:userId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const updateData = req.body;
            yield this.UserModel.updateUser(res, userId, updateData);
        }));
        // Delete a user's profile by userId
        router.delete("/app/user/profile/:userId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            yield this.UserModel.deleteUser(res, userId);
        }));
        // Mount the router on the Express application
        this.expressApp.use("/", router);
        this.expressApp.use("/app/json/", express.static(`${__dirname}/app/json`));
        this.expressApp.use("/images", express.static(`${__dirname}/img`));
        this.expressApp.use("/", express.static(`${__dirname}/pages`));
        // Adjusted path to point to the 'recipes' folder in the root
        this.expressApp.use("/", express.static(`${__dirname}/../recipes/browser`));
        // Fallback route for Angular SPA
        this.expressApp.get("*", (req, res) => {
            res.sendFile(`${__dirname}/../recipes/browser/index.html`);
        });
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map