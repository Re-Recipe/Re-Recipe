import * as express from 'express';
import * as bodyParser from 'body-parser';
import {RecipeModel} from './model/RecipeModel';
import {ModifiedRecipeModel} from './model/ModifiedRecipeModel';
import {CookbookModel} from './model/CookbookModel';
import * as crypto from 'crypto';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;
  public RecipeList:RecipeModel;
  public Cookbook:CookbookModel;

  //Run configuration methods on the Express instance.
  constructor(mongoDBConnection:string)
  {
    this.expressApp = express();
    this.middleware();
    this.routes();
    this.RecipeList = new RecipeModel(mongoDBConnection);
    // this.ModifiedRecipes = new ModifiedRecipeModel(mongoDBConnection);
    this.Cookbook = new CookbookModel(mongoDBConnection);
  }

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use( (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

    // Get one recipe from recipe list by recipeID
    router.get('/app/recipelist/:recipeID/', async (req, res) => {
        var id = req.params.recipe_ID;
        console.log('Query recipe list with id: ' + id);
        await this.RecipeList.retrieveRecipe(res, id);
    });

    //
   /* router.get('/app/list/:listId', async (req, res) => {
      var id = req.params.listId;
      console.log('Query single list with id: ' + id);
      await this.Lists.retrieveRecipe(res, id);
    });

    router.post('/app/list/', async (req, res) => {
      const id = crypto.randomBytes(16).toString("hex");
      console.log(req.body);
        var jsonObj = req.body;
        jsonObj.listId = id;
        try {
          await this.Lists.model.create([jsonObj]);
          res.send('{"id":"' + id + '"}');
        }
        catch (e) {
          console.error(e);
          console.log('object creation failed');
        }
    });

    router.post('/app/list2/', async (req, res) => {
      const id = crypto.randomBytes(16).toString("hex");
      console.log(req.body);
        var jsonObj = req.body;
        jsonObj.listId = id;
        const doc = new this.Lists.model(jsonObj);
        try {
          await doc.save();
          res.send('{"id":"' + id + '"}');
        }
        catch (e) {
          console.log('object creation failed');
          console.error(e);
        }        
    });

    router.get('/app/list/:listId/tasks', async (req, res) => {
        var id = req.params.listId;
        console.log('Query single list with id: ' + id);
        await this.Tasks.retrieveTasksDetails(res, {listId: id});
    });

    router.get('/app/list/', async (req, res) => {
        console.log('Query All list');
        await this.Lists.retrieveAllLists(res);
    });

    router.get('/app/listcount', async (req, res) => {
      console.log('Query the number of list elements in db');
      await this.Lists.retrieveListCount(res);
    });
*/
    this.expressApp.use('/', router);

    this.expressApp.use('/app/json/', express.static(__dirname+'/app/json'));
    this.expressApp.use('/images', express.static(__dirname+'/img'));
    this.expressApp.use('/', express.static(__dirname+'/pages'));
    
  }

}

export {App};