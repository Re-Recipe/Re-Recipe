import * as express from 'express';
import * as bodyParser from 'body-parser'; // for parsing url requests and json
import { RecipeModel } from './model/RecipeModel';
import { ModifiedRecipeModel } from './model/ModifiedRecipeModel';
import { CookbookModel } from './model/CookbookModel';
import * as crypto from 'crypto'; // import crypto library for unique ID generation


/**
 * The main application class that sets up the Express server (main server to handle HTTP requests),
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
    this.middleware();
    this.routes();
    this.RecipeList = new RecipeModel(mongoDBConnection);
    this.ModifiedRecipes = new ModifiedRecipeModel(mongoDBConnection);
    this.Cookbook = new CookbookModel(mongoDBConnection);
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
   *
   * @private
   * @returns {void}
   */
  private routes(): void {
    const router = express.Router();

    /**
     * GET /app/recipes
     * Retrieves all recipes.
     *
     * @route GET /app/recipes
     * @param {express.Request} req - The request object.
     * @param {express.Response} res - The response object.
     * @returns {Promise<void>} - Resolves when the response is sent.
     */
    router.get('/app/recipes', async (req: express.Request, res: express.Response): Promise<void> => {
      await this.RecipeList.retrieveAllRecipes(res);
    });

    /**
     * GET /app/recipes/:recipeID
     * Retrieves a specific recipe by its ID.
     *
     * @route GET /app/recipes/:recipeID
     * @param {express.Request} req - The request object.
     * @param {express.Response} res - The response object.
     * @returns {Promise<void>} - Resolves when the response is sent.
     */
    router.get('/app/recipes/:recipeID', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      console.log('Query recipe list with id:', recipeID);
      await this.RecipeList.retrieveRecipe(res, recipeID);
    });

    /**
     * POST /app/recipes
     * Adds a new recipe.
     *
     * @route POST /app/recipes
     * @param {express.Request} req - The request object containing the recipe data.
     * @param {express.Response} res - The response object.
     * @returns {Promise<void>} - Resolves when the response is sent.
     */
    router.post('/app/recipes', async (req: express.Request, res: express.Response): Promise<void> => {
      const id: string = crypto.randomBytes(16).toString("hex"); // generate unique recipe_ID
      const jsonObj: object = { ...req.body, recipe_ID: id };
      await this.RecipeList.model.create(jsonObj);
      res.status(201).json({ id });
    });

    /**
     * PUT /app/recipes/:recipeID/directions
     * Updates the directions of a specific recipe.
     *
     * @route PUT /app/recipes/:recipeID/directions
     * @param {express.Request} req - The request object containing the updated directions.
     * @param {express.Response} res - The response object.
     * @returns {Promise<void>} - Resolves when the response is sent.
     */
    router.put('/app/recipes/:recipeID/directions', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      const { directions }: { directions: string[] } = req.body;
      if (!Array.isArray(directions)) {
        res.status(400).json({ error: "Directions must be an array." });
        return;
      }
      await this.RecipeList.updateDirections(res, recipeID, directions);
    });

    /**
     * PUT /app/recipes/:recipeID/directions/:stepIndex
     * Updates a specific step in the directions of a recipe.
     *
     * @route PUT /app/recipes/:recipeID/directions/:stepIndex
     * @param {express.Request} req - The request object containing the new step.
     * @param {express.Response} res - The response object.
     * @returns {Promise<void>} - Resolves when the response is sent.
     */
    router.put('/app/recipes/:recipeID/directions/:stepIndex', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      const stepIndex: number = parseInt(req.params.stepIndex, 10);
      const { newStep }: { newStep: string } = req.body;
      if (isNaN(stepIndex) || stepIndex < 0) {
        res.status(400).json({ error: "Invalid step index." });
        return;
      }

      if (typeof newStep !== 'string' || newStep.trim() === '') {
        res.status(400).json({ error: "New step must be a non-empty string." });
        return;
      }
      await this.RecipeList.updateDirectionStep(res, recipeID, stepIndex, newStep);
    });

    /**
     * PUT /app/recipes/:recipeID/ingredients
     * Updates the ingredients of a specific recipe.
     *
     * @route PUT /app/recipes/:recipeID/ingredients
     * @param {express.Request} req - The request object containing the updated ingredients.
     * @param {express.Response} res - The response object.
     * @returns {Promise<void>} - Resolves when the response is sent.
     */
    router.put('/app/recipes/:recipeID/ingredients', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      const { ingredients }: { ingredients: { name: string; quantity: number; unit: string }[] } = req.body;
      await this.RecipeList.updateIngredients(res, recipeID, ingredients);
    });

    /**
     * DELETE /app/recipes/:recipeID
     * Deletes a recipe by its ID.
     *
     * @route DELETE /app/recipes/:recipeID
     * @param {express.Request} req - The request object.
     * @param {express.Response} res - The response object.
     * @returns {Promise<void>} - Resolves when the response is sent.
     */
    router.delete('/app/recipes/:recipeID', async (req: express.Request, res: express.Response): Promise<void> => {
      const recipeID: string = req.params.recipeID;
      await this.RecipeList.deleteRecipe(res, recipeID);
    });

    // Mount the router on the Express application
    this.expressApp.use('/', router);

    this.expressApp.use('/app/json/', express.static(`${__dirname}/app/json`));
    this.expressApp.use('/images', express.static(`${__dirname}/img`));
    this.expressApp.use('/', express.static(`${__dirname}/pages`));
  }
}

export { App };
