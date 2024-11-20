import * as express from "express";
import * as bodyParser from "body-parser"; // for parsing URL requests and JSON
import { RecipeModel } from "./model/RecipeModel";
import { DiscoverModel } from "./model/DiscoverModel";
import { CookbookModel } from "./model/CookbookModel";
import * as crypto from "crypto"; // for unique ID generation

/**
 * The main application class that sets up the Express server,
 * middleware, routes, and database models.
 */
class App {
  public expressApp: express.Application;
  public RecipeList: RecipeModel;
  public Cookbook: CookbookModel;
  public DiscoverModel: DiscoverModel;

  /**
   * Creates an instance of the App.
   *
   * @param {string} mongoDBConnection - The MongoDB connection string.
   */
  constructor(mongoDBConnection: string) {
    this.expressApp = express();
    this.DiscoverModel = new DiscoverModel(mongoDBConnection);
    this.Cookbook = new CookbookModel(mongoDBConnection);
    this.middleware();
    this.routes();
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
  }

  /**
   * Defines the routes/endpoints for the application and associates
   * them with their respective handlers.
   */
  private routes(): void {
    const router = express.Router();

    // Recipe CRUD Routes
    router.get(
      "/app/recipes",
      async (req: express.Request, res: express.Response): Promise<void> => {
        await this.DiscoverModel.retrieveAllRecipes(res);
      }
    );

    router.get(
      "/app/recipes/:recipeID",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const recipeID: string = req.params.recipeID;
        console.log("Query recipe list with id:", recipeID);
        await this.DiscoverModel.retrieveRecipe(res, recipeID);
      }
    );

    router.post(
      "/app/recipes",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const id: string = crypto.randomBytes(16).toString("hex");
        const jsonObj: object = { ...req.body, recipe_ID: id };
        await this.DiscoverModel.model.create(jsonObj);
        res.status(201).json({ id });
      }
    );

    router.delete(
      "/app/recipes/:recipeID",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const recipeID: string = req.params.recipeID;
        await this.DiscoverModel.deleteRecipe(res, recipeID);
      }
    );

    // Cookbook Routes

    // Retrieve all recipes in a user's cookbook
    router.get(
      "/app/cookbook/:userId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        try {
          // Fetch the user's cookbook
          await this.Cookbook.listAllRecipes(res, userId);
        } catch (error) {
          console.error("Failed to fetch cookbook:", error);
          res.status(500).json({ error: "Failed to fetch cookbook data" });
        }
      }
    );

    // Delete a specific recipe from a user's cookbook
    router.delete(
      "/app/cookbook/:userId/recipes/:recipeId",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        const recipeId: string = req.params.recipeId;

        try {
          await this.Cookbook.removeRecipeFromCookbook(res, userId, recipeId);
        } catch (error) {
          console.error("Failed to delete recipe:", error);
          res
            .status(500)
            .json({ error: "Failed to delete recipe from cookbook" });
        }
      }
    );

    // Add a new version to a recipe in a user's cookbook
    router.post(
      "/app/cookbook/:userId/recipes/:recipeId/versions",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;
        const recipeId: string = req.params.recipeId;
        const versionData = req.body.versionData; // New version details in request body

        if (!versionData || typeof versionData !== "object") {
          res
            .status(400)
            .json({ error: "Version data must be a valid object." });
          return;
        }

        try {
          await this.Cookbook.addRecipeVersion(
            res,
            userId,
            recipeId,
            versionData
          );
        } catch (error) {
          console.error("Failed to add recipe version:", error);
          res.status(500).json({ error: "Failed to add recipe version" });
        }
      }
    );

    // Retrieve all recipes in a user's cookbook
    router.get(
      "/app/cookbook/:userId/recipes",
      async (req: express.Request, res: express.Response): Promise<void> => {
        const userId: string = req.params.userId;

        try {
          // Call the listAllRecipes method from CookbookModel
          await this.Cookbook.listAllRecipes(res, userId);
        } catch (error) {
          console.error("Failed to fetch recipes:", error);
          res.status(500).json({ error: "Failed to fetch recipes" });
        }
      }
    );

    // Mount the router on the Express application
    this.expressApp.use("/", router);
    this.expressApp.use("/app/json/", express.static(`${__dirname}/app/json`));
    this.expressApp.use("/images", express.static(`${__dirname}/img`));
    this.expressApp.use("/", express.static(`${__dirname}/pages`));
  }
}

export { App };
