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
const GooglePassport_1 = require("./GooglePassport");
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
        this.googlePassportObj = new GooglePassport_1.default();
        this.expressApp = express();
        this.DiscoverModel = new DiscoverModel_1.DiscoverModel(mongoDBConnection);
        this.Cookbook = new CookbookModel_1.CookbookModel(mongoDBConnection, DiscoverModel_1.DiscoverModel);
        this.UserModel = new UserModel_1.UserModel(mongoDBConnection); // Initialize UserModel
        this.middleware();
        this.routes();
    }
    validateAuth(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("user is authenticated");
            return next();
        }
        console.log("user is not authenticated");
        res.redirect("/");
    }
    /**
     * Sets up middleware for the Express application, including
     * body parsing and CORS headers.
     */
    middleware() {
        // CORS headers to allow frontend (running on http://localhost:4200) to access the backend
        this.expressApp.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Allow frontend to access
            res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        // Body parsing middleware
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        // Session and cookie parsing middleware
        this.expressApp.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));
        this.expressApp.use(cookieParser());
        // Passport initialization
        this.expressApp.use(passport.initialize());
        this.expressApp.use(passport.session());
    }
    /**
     * Defines the routes/endpoints for the application and associates
     * them with their respective handlers.
     */
    routes() {
        const router = express.Router();
        router.get('/app/auth/check', (req, res) => {
            if (req.isAuthenticated()) {
                return res.json({ loggedIn: true });
            }
            res.json({ loggedIn: false });
        });
        router.get("/app/logout", (req, res) => {
            req.logout((err) => {
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
        // Add a new recipe in a user's cookbook
        router.post("/app/cookbook/:userId/recipes/:recipeId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const recipeId = req.params.recipeId;
            yield this.Cookbook.copyRecipeFromDiscover(res, recipeId, userId);
        }));
        /**
         * ====================
         * SECTION: USER ROUTES
         * ====================
         */
        router.get("/app/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
            console.log("User successfully authenticated");
            console.log("Session User:", req.user);
            res.redirect("http://localhost:4200/discover");
        });
        router.get('/app/auth/check', (req, res) => {
            if (req.isAuthenticated()) {
                console.log('User is authenticated:', req.user);
                return res.json({ loggedIn: true });
            }
            console.log('User is not authenticated');
            res.json({ loggedIn: false });
        });
        // Google SSO Sign - In
        router.get("/app/auth/google", passport.authenticate("google", { scope: ["profile"] }));
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
        // The static end point for angular and fallback
        this.expressApp.use("/", express.static(`${__dirname}/../recipes/browser`));
        this.expressApp.get("*", (req, res) => {
            res.sendFile(`${__dirname}/../recipes/browser/index.html`);
        });
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map