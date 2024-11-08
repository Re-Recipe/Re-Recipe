import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";

class RecipeModel {
    public schema: mongoose.Schema<IRecipe>;
    public model: mongoose.Model<IRecipe>;
    public dbConnectionString: string;

    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param DB_CONNECTION_STRING - Connection string for MongoDB.
     */
    public constructor(DB_CONNECTION_STRING: string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    /**
     * Creates the Mongoose schema for a recipe.
     * Defines the structure for `recipeID`, `recipeName`, `category`, etc.
     */
    public createSchema() {
        this.schema = new mongoose.Schema(
            {
                recipeID: { type: String, required: true }, // Unique identifier for recipe
                userID: { type: String, required: true }, // Author of recipe
                recipeName: { type: String, required: true }, // Title of recipe
                category: [
                    {
                        type: String,
                        enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'vegan', 'gluten-free'],
                        required: true,
                    }
                ],
                cookingDuration: { type: Number, required: true }, // Time it takes to cook recipe
                ingredients: [ // Ingredient requirements for recipe
                    {
                        name: { type: String, required: true },
                        quantity: { type: Number, required: true },
                        unit: {
                            type: String,
                            enum: ['oz', 'cup', 'tbsp', 'tsp', 'g', 'kg', 'lb', 'each'],
                            required: true,
                        },
                        ingredientID: { type: String }, // Optional
                    }
                ],
                directions: [ // List of directions for making recipe
                    {
                        step: { type: String, required: true }, // Allows changing individual steps
                    }
                ],
                imageUrl: { type: String }, // Image of recipe
                isVisible: { type: Boolean, default: true }, // Published or private recipe
            },
            { collection: "recipes", timestamps: true }
        );
    }

    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     * The model is stored in `this.model`.
     */
    public async createModel() {
        try {
            await mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true }); // Connects to MongoDB database
            this.model = mongoose.model<IRecipe>("Recipe", this.schema);
            console.log("Connected to MongoDB and initialized Recipe model.");
        } catch (e) {
            console.error("Error connecting to MongoDB or initializing Recipe model:", e);
        }
    }

    /**
     * Retrieves all recipes from the database.
     * @param response - The response object to send data back to the client.
     */
    public async retrieveAllRecipes(response: any) {
        try {
            const itemArray = await this.model.find({}).exec();
            response.json(itemArray);
        } catch (e) {
            console.error("Failed to retrieve recipes:", e);
            response.status(500).json({ error: "Failed to retrieve recipes" });
        }
    }

    /**
     * Retrieves a single recipe by `recipeID`.
     * @param response - The response object to send data back to the client.
     * @param recipeID - The unique ID of the recipe to retrieve.
     */
    public async retrieveRecipe(response: any, recipeID: string) {
        try {
            const result = await this.model.findOne({ recipeID }).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (e) {
            console.error("Failed to retrieve recipe:", e);
            response.status(500).json({ error: "Failed to retrieve recipe" });
        }
    }

    /**
     * Counts and retrieves the total number of recipes in the database.
     * @param response - The response object to send data back to the client.
     */
    public async retrieveRecipeListCount(response: any) {
        try {
            const numberOfRecipes = await this.model.estimatedDocumentCount().exec();
            response.json({ count: numberOfRecipes });
        } catch (e) {
            console.error("Failed to retrieve recipe count:", e);
            response.status(500).json({ error: "Failed to retrieve recipe count" });
        }
    }

    /**
     * Deletes a recipe by its `recipeID`.
     * @param response - The response object to send data back to the client.
     * @param recipeID - The unique ID of the recipe to delete.
     */
    public async deleteRecipe(response: any, recipeID: string) {
        try {
            const result = await this.model.deleteOne({ recipeID }).exec();
            if (result.deletedCount && result.deletedCount > 0) {
                response.json({ message: `Recipe ${recipeID} deleted successfully.`, result });
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (e) {
            console.error("Failed to delete recipe:", e);
            response.status(500).json({ error: "Failed to delete recipe" });
        }
    }

    /**
     * Updates the `directions` of a recipe by `recipeID`.
     * @param response - The response object to send data back to the client.
     * @param recipeID - The unique ID of the recipe to update.
     * @param directions - An array of objects containing the new steps for directions.
     */
    public async updateDirections(response: any, recipeID: string, directions: { step: string }[]) {
        try {
            const result = await this.model.findOneAndUpdate(
                { recipeID },
                { $set: { directions } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update directions:", e);
            response.status(500).json({ error: "Failed to update directions" });
        }
    }

    /**
     * Updates the `ingredients` of a recipe by `recipeID`.
     * @param response - The response object to send data back to the client.
     * @param recipeID - The unique ID of the recipe to update.
     * @param ingredients - An array of objects containing `name`, `quantity`, and `unit` for each ingredient.
     */
    public async updateIngredients(response: any, recipeID: string, ingredients: { name: string; quantity: number; unit: string }[]) {
        try {
            const result = await this.model.findOneAndUpdate(
                { recipeID },
                { $set: { ingredients } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update ingredients:", e);
            response.status(500).json({ error: "Failed to update ingredients" });
        }
    }

    /**
     * Updates the `imageUrl` of a recipe by `recipeID`.
     * @param response - The response object to send data back to the client.
     * @param recipeID - The unique ID of the recipe to update.
     * @param imageUrl - The new image URL for the recipe.
     */
    public async updateImageUrl(response: any, recipeID: string, imageUrl: string) {
        try {
            const result = await this.model.findOneAndUpdate(
                { recipeID },
                { $set: { imageUrl } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update image URL:", e);
            response.status(500).json({ error: "Failed to update image URL" });
        }
    }

    /**
     * Updates the `isVisible` field of a recipe by `recipeID`.
     * @param response - The response object to send data back to the client.
     * @param recipeID - The unique ID of the recipe to update.
     * @param isVisible - Boolean indicating if the recipe should be visible.
     */
    public async updateVisibility(response: any, recipeID: string, isVisible: boolean) {
        try {
            const result = await this.model.findOneAndUpdate(
                { recipeID },
                { $set: { isVisible } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update visibility:", e);
            response.status(500).json({ error: "Failed to update visibility" });
        }
    }
}

export { RecipeModel };
