import * as express from 'express';
import * as bodyParser from 'body-parser'; // for parsing URL requests and JSON
import { RecipeModel } from './model/RecipeModel';
import { ModifiedRecipeModel } from './model/ModifiedRecipeModel';
import { CookbookModel } from './model/CookbookModel';
import * as crypto from 'crypto'; // for unique ID generation

/**
 * The main application class that sets up the Express server,
 * middleware, routes, and database models.
 */
class App {
  public expressApp: express.Application;
  public RecipeList: RecipeModel;
  public Cookbook: CookbookModel;
  public ModifiedRecipes: ModifiedRecipeModel;

  /**
   * Creates an instance of the App.
   *
   * @param {string} mongoDBConnection - The MongoDB connection string.
   */
  constructor(mongoDBConnection: string) {
    this.expressApp = express();
    this.RecipeList = new RecipeModel(mongoDBConnection);
    this.ModifiedRecipes = new ModifiedRecipeModel(mongoDBConnection);
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
    this.expressApp.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  /**
   * Defines the routes/endpoints for the application and associates
   * them with their respective handlers.
   */
  private routes(): void {
    const router = express.Router();

    // Recipe CRUD Routes
    router.get('/app/recipes', async (req: express.Request, res: express.Response): Promise<void> => {
      await this.RecipeList.retrieveAllRecipes(res);
    });

    router.get('/app/recipes/:recipeID', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      console.log('Query recipe list with id:', recipeID);
      await this.RecipeList.retrieveRecipe(res, recipeID);
    });

    router.post('/app/recipes', async (req: express.Request, res: express.Response): Promise<void> => {
      const id: string = crypto.randomBytes(16).toString("hex");
      const jsonObj: object = { ...req.body, recipe_ID: id };
      await this.RecipeList.model.create(jsonObj);
      res.status(201).json({ id });
    });

    router.put('/app/recipes/:recipeID/directions', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      const { directions }: { directions: string[] } = req.body;
      if (!Array.isArray(directions) || directions.some(step => typeof step !== "string" || step.trim() === "")) {
        res.status(400).json({ error: "Directions must be an array of non-empty strings." });
        return;
      }
      const formattedDirections = directions.map(step => ({ step }));
      await this.RecipeList.updateDirections(res, recipeID, formattedDirections);
    });

    router.put('/app/recipes/:recipeID/ingredients', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      const { ingredients }: { ingredients: { name: string; quantity: number; unit: string }[] } = req.body;
      await this.RecipeList.updateIngredients(res, recipeID, ingredients);
    });

    router.delete('/app/recipes/:recipeID', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      await this.RecipeList.deleteRecipe(res, recipeID);
    });

    // Cookbook Routes
    router.get('/app/cookbook/:userId', async (req: express.Request, res: express.Response): Promise<void> => {
      const userId: string = req.params.userId;
      try {
        // Fetch the user's cookbook
        await this.Cookbook.listAllRecipes(res, userId);
      } catch (error) {
        console.error("Failed to fetch cookbook:", error);
        res.status(500).json({ error: "Failed to fetch cookbook data" });
      }
    });

    // Route to add multiple new recipes to the user's cookbook
    router.post('/app/cookbook/:userId/recipes', async (req: express.Request, res: express.Response): Promise<void> => {
      const userId: string = req.params.userId;
      const newRecipes: any[] = req.body.newRecipes; // Expecting an array of new recipe objects from the request body

      if (!Array.isArray(newRecipes) || newRecipes.length === 0) {
        res.status(400).json({ error: "newRecipes must be a non-empty array of recipe objects." });
        return;
      }

      try {
        await this.Cookbook.addManyNewRecipes(res, userId, newRecipes);
      } catch (error) {
        console.error("Failed to add new recipes:", error);
        res.status(500).json({ error: "Failed to add new recipes" });
      }
    });

    // Mount the router on the Express application
    this.expressApp.use('/', router);
    this.expressApp.use('/app/json/', express.static(`${__dirname}/app/json`));
    this.expressApp.use('/images', express.static(`${__dirname}/img`));
    this.expressApp.use('/', express.static(`${__dirname}/pages`));
  }
}

export { App };
