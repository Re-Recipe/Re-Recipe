import * as express from 'express';
import * as bodyParser from 'body-parser';
import { RecipeModel } from './model/RecipeModel';
import { ModifiedRecipeModel } from './model/ModifiedRecipeModel';
import { CookbookModel } from './model/CookbookModel';
import * as crypto from 'crypto';

class App {
  public expressApp: express.Application;
  public RecipeList: RecipeModel;
  public Cookbook: CookbookModel;
  public ModifiedRecipes: ModifiedRecipeModel;

  constructor(mongoDBConnection: string) {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.RecipeList = new RecipeModel(mongoDBConnection);
    this.ModifiedRecipes = new ModifiedRecipeModel(mongoDBConnection);
    this.Cookbook = new CookbookModel(mongoDBConnection);
  }

  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  private routes(): void {
    let router = express.Router();

    // Retrieve all recipes
    router.get('/app/recipes', async (req, res) => {
      await this.RecipeList.retrieveAllRecipes(res);
    });

    // Retrieve a specific recipe by recipe_ID
    router.get('/app/recipes/:recipeID', async (req, res) => {
      const recipeID = req.params.recipeID;
      console.log('Query recipe list with id: ' + recipeID);
      await this.RecipeList.retrieveRecipe(res, recipeID);
    });

    // Add a new recipe
    router.post('/app/recipes', async (req, res) => {
      const id = crypto.randomBytes(16).toString("hex");
      const jsonObj = { ...req.body, recipe_ID: id };
      try {
        await this.RecipeList.model.create(jsonObj);
        res.json({ id });
      } catch (e) {
        console.error('Failed to create recipe:', e);
        res.status(500).json({ error: "Failed to create recipe" });
      }
    });

    // Update the directions of a recipe
    router.put('/app/recipes/:recipeID/directions', async (req, res) => {
      const recipeID = req.params.recipeID;
      const { directions } = req.body;
      await this.RecipeList.updateDirections(res, recipeID, directions);
    });

    // Update a specific direction step of a recipe
    router.put('/app/recipes/:recipeID/directions/:stepIndex', async (req, res) => {
      const recipeID = req.params.recipeID;
      const stepIndex = parseInt(req.params.stepIndex);
      const { newStep } = req.body;
      await this.RecipeList.updateDirectionStep(res, recipeID, stepIndex, newStep);
    });

    // Update the ingredients of a recipe
    router.put('/app/recipes/:recipeID/ingredients', async (req, res) => {
      const recipeID = req.params.recipeID;
      const { ingredients } = req.body;
      await this.RecipeList.updateIngredients(res, recipeID, ingredients);
    });

    // Delete a recipe by recipe_ID
    router.delete('/app/recipes/:recipeID', async (req, res) => {
      const recipeID = req.params.recipeID;
      await this.RecipeList.deleteRecipe(res, recipeID);
    });

    // Serve static files
    this.expressApp.use('/', router);
    this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
    this.expressApp.use('/images', express.static(__dirname + '/img'));
    this.expressApp.use('/', express.static(__dirname + '/pages'));
  }
}

export { App };
