import * as express from "express";
import * as bodyParser from "body-parser"; // For parsing URL requests and JSON
import { RecipeModel } from "./model/RecipeModel";
import { DiscoverModel } from "./model/DiscoverModel";
import { CookbookModel } from "./model/CookbookModel";
import { UserModel } from "./model/UserModel"; // Import the UserModel
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as passport from "passport";
import GooglePassportObj from "./GooglePassport";


declare global {
  namespace Express {
    interface User {
      id: string,
      displayName: string,
    }
  }
}
// TODO: make a data access file
//import {DataAccess} from './DataAccess';

/**
 * The main application class that sets up the Express server,
 * middleware, routes, and database models.
 */
class App {
  public expressApp: express.Application;
  public RecipeList: RecipeModel;
  public Cookbook: CookbookModel;
  public DiscoverModel: DiscoverModel;
  public UserModel: UserModel;
  public googlePassportObj: GooglePassportObj;

  /**
   * Creates an instance of the App.
   *
   * @param {string} mongoDBConnection - The MongoDB connection string.
   */
  constructor(mongoDBConnection: string) {
    this.googlePassportObj = new GooglePassportObj();
    this.expressApp = express();
    this.DiscoverModel = new DiscoverModel(mongoDBConnection);
    this.Cookbook = new CookbookModel(mongoDBConnection, DiscoverModel);
    this.UserModel = new UserModel(mongoDBConnection); // Initialize UserModel
    this.middleware();
    this.routes();
  }
  private validateAuth(req, res, next): void {
    if (req.isAuthenticated()) {
      console.log("User is authenticated");
      return next();
    }
  
    console.log("User is not authenticated");
    res.status(401).json({ error: "Unauthorized" });
  }
  
  /**
   * Sets up middleware for the Express application, including
   * body parsing and CORS headers.
   */
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      }
    );

      // Body parsing middleware
      this.expressApp.use(bodyParser.json());
      this.expressApp.use(bodyParser.urlencoded({ extended: false }));

      // Session and cookie parsing middleware
      this.expressApp.use(session({ secret: "1234567890QWERTY", resave: false, saveUninitialized: true }));
      this.expressApp.use(cookieParser());

      // Passport initialization
      this.expressApp.use(passport.initialize());
      this.expressApp.use(passport.session());
  }

  /**
   * Defines the routes/endpoints for the application and associates
   * them with their respective handlers.
   */
  private routes(): void {
    const router = express.Router();

    /**
     * ========================
     * SECTION: DISCOVER ROUTES
     * ========================
     */

    // Retrieve all recipes in the Discover collection
    router.get(
      "/app/discover",
      async (req: express.Request, res: express.Response): Promise<void> => {
        await this.DiscoverModel.retrieveAllRecipes(res);
      }
    );

    // Retrieve a specific recipe from the Discover collection by recipeID
    router.get(
      "/app/discover/:recipeID",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const recipeID: string = req.params.recipeID;
        await this.DiscoverModel.retrieveRecipe(res, recipeID);
      }
    );

    // Add a new recipe to the Discover collection
    router.post(
      "/app/discover",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const newRecipeData = req.body;
        await this.DiscoverModel.createRecipe(res, newRecipeData);
      }
    );

    // Delete a recipe from the Discover collection by recipeID
    router.delete(
      "/app/discover/:recipeID",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const recipeID: string = req.params.recipeID;
        await this.DiscoverModel.deleteRecipe(res, recipeID);
      }
    );

    /**
     * ========================
     * SECTION: COOKBOOK ROUTES
     * ========================
     */

    // Retrieve all recipes in a user's cookbook
    router.get(
      "/app/cookbook/:userId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        await this.Cookbook.listAllRecipes(res, userId);
      }
    );

    // Remove a specific recipe from a user's cookbook
    router.delete(
      "/app/cookbook/:userId/recipes/:recipeId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        const recipeId: string = req.params.recipeId;
        await this.Cookbook.removeRecipeFromCookbook(res, userId, recipeId);
      }
    );

    // Add a new recipe in a user's cookbook
    router.post(
      "/app/cookbook/:userId/recipes/:recipeId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        const recipeId: string = req.params.recipeId;
        await this.Cookbook.copyRecipeFromDiscover(res, recipeId, userId);
      }
    );

    /**
     * ====================
     * SECTION: USER ROUTES
     * ====================
     */
    router.get(
        "/app/auth/google/callback",
        passport.authenticate("google", { failureRedirect: "/" }),
        (req, res) => {
            console.log("User successfully authenticated");
            console.log("Session User:", req.user);
            console.log("user info:" + JSON.stringify(req.user));
        console.log("user info:" + JSON.stringify(req.user.id));
        console.log("user info:" + JSON.stringify(req.user.displayName));
            res.redirect("http://localhost:4200/discover");
        }
    );
      router.get('/app/auth/check', (req, res) => {
          if (this.validateAuth) {
              console.log('User is authenticated:', req.user);
              return res.json({ loggedIn: true });
          }
          console.log('User is not authenticated');
          res.json({ loggedIn: false });
      });
      router.get('/app/profile',this.validateAuth, (req, res) => {
        console.log('Query All list');
        console.log("user info:" + JSON.stringify(req.user));
        console.log("user info:" + JSON.stringify(req.user.id));
        console.log("user info:" + JSON.stringify(req.user.displayName));
        res.json({"username" : req.user.displayName, "id" : req.user.id});
      });

    // Google SSO Sign - In
    router.get(
      "/app/auth/google",
      passport.authenticate("google", { scope: ["profile"] })
    );
    
    router.get('/app/auth/info', this.validateAuth, (req, res) => {
    console.log('Query All list');
    console.log("user info:" + JSON.stringify(req.user));
    console.log("user info:" + JSON.stringify(req.user.id));
    console.log("user info:" + JSON.stringify(req.user.displayName));
    res.json({"username" : req.user.displayName, "id" : req.user.id});
  });

    

    // Retrieve a user's profile by userId
    router.get(
      "/app/user/profile/:userId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        await this.UserModel.getUserProfile(res, userId);
      }
    );

    // Update a user's profile information
    router.put(
      "/app/user/profile/:userId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        const updateData = req.body;
        await this.UserModel.updateUser(res, userId, updateData);
      }
    );

    // Delete a user's profile by userId
    router.delete(
      "/app/user/profile/:userId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        await this.UserModel.deleteUser(res, userId);
      }
    );


    // Mount the router on the Express application
    this.expressApp.use("/", router);
    this.expressApp.use("/app/json/", express.static(`${__dirname}/app/json`));
    this.expressApp.use("/images", express.static(`${__dirname}/img`));

    //The static end point for angular and fallback
    // Updated for root 
    this.expressApp.use("/", express.static(`${__dirname}/recipes/browser`));

    this.expressApp.get(
      "*",
      (req: express.Request, res: express.Response): void => {
        res.sendFile(`${__dirname}/recipes/browser/index.html`);
      }
    );
  }
}
export { App };