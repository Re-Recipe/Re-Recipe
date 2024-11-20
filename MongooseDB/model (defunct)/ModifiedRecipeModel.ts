// models/ModifiedRecipeModel.ts
import * as mongoose from "mongoose";
import {IRecipe} from '../interfaces/IRecipe';

class ModifiedRecipeModel {
    public schema: mongoose.Schema<IRecipe>;
    public model: mongoose.Model<IRecipe>;
    public dbConnectionString: string;

    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param DB_CONNECTION_STRING - MongoDB connection string.
     */
    public constructor(DB_CONNECTION_STRING: string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    /**
     * Creates the Mongoose schema for a modified recipe.
     * Includes fields for user-specific modifications and version control.
     */
    public createSchema() {
        const schemaDefinition: mongoose.SchemaDefinition<IRecipe> = {
            user_ID: { type: String, required: true },
            recipe_ID: { type: String, required: true },
            personal_recipe_ID: { type: String, unique: true, required: true },
            recipe_name: { type: String, required: true },
            category: [{
                type: String,
                enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'vegan', 'gluten-free'],
                required: true,
            }],
            cooking_duration: { type: Number, required: true },
            ingredients: [{
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                unit: {
                    type: String,
                    enum: ['oz', 'cup', 'tbsp', 'tsp', 'g', 'kg', 'lb', 'each'],
                    required: true
                }
            }],
            directions: [{
                step: { type: String, required: true }
            }],
            notes: { type: String },
            version_number: { type: Number, default: 1, required: true },
            image_url: { type: String },
            is_visible: { type: Boolean, default: false }
        };

        this.schema = new mongoose.Schema(schemaDefinition, { collection: 'modifiedRecipes' });
    }

    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     * The model is stored in `this.model`.
     * @returns void
     */
    public async createModel() {
        try {
            await mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
            this.model = mongoose.model<IRecipe>("ModifiedRecipe", this.schema);
            console.log("Connected to MongoDB and Initialized ModifiedRecipe model.");
        } catch (e) {
            console.error("Error connecting to MongoDB or initializing ModifiedRecipe model:", e);
        }
    }

    /**
     * Adds a new modified recipe.
     * @param modifiedRecipe - Object containing modified recipe details.
     * @returns The saved modified recipe document.
     */
    public async createModifiedRecipe(modifiedRecipe: IRecipe) {
        try {
            const newRecipe = new this.model(modifiedRecipe);
            return await newRecipe.save();
        } catch (e) {
            console.error("Error creating modified recipe:", e);
            throw e;
        }
    }

    /**
     * Retrieves a modified recipe by `personal_recipe_ID`.
     * @param personal_recipe_ID - The unique ID of the modified recipe.
     * @param response - Response object to send data back to the client.
     */
    public async retrieveModifiedRecipe(response: any, personal_recipe_ID: string) {
        try {
            const result = await this.model.findOne({ personal_recipe_ID }).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Modified recipe not found" });
            }
        } catch (e) {
            console.error("Failed to retrieve modified recipe:", e);
            response.status(500).json({ error: "Failed to retrieve modified recipe" });
        }
    }

    /**
     * Updates the ingredients of a modified recipe by `personal_recipe_ID`.
     * @param personal_recipe_ID - The unique ID of the modified recipe.
     * @param newIngredients - Updated ingredients array.
     * @param response - Response object to send updated data.
     */
    public async updateRecipeIngredients(response: any, personal_recipe_ID: string, newIngredients: { name: string; quantity: number; unit: string }[]) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_ID },
                { $set: { ingredients: newIngredients } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Modified recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update ingredients:", e);
            response.status(500).json({ error: "Failed to update ingredients" });
        }
    }

    /**
     * Updates the directions of a modified recipe by `personal_recipe_ID`.
     * @param personal_recipe_ID - The unique ID of the modified recipe.
     * @param newDirections - Updated directions array.
     * @param response - Response object to send updated data.
     */
    public async updateRecipeDirections(response: any, personal_recipe_ID: string, newDirections: { step: string }[]) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_ID },
                { $set: { directions: newDirections } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Modified recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update directions:", e);
            response.status(500).json({ error: "Failed to update directions" });
        }
    }

    /**
     * Deletes a modified recipe by its `personal_recipe_ID`.
     * @param personal_recipe_ID - The unique ID of the modified recipe.
     * @param response - Response object to send deletion result.
     */
    public async deleteModifiedRecipe(response: any, personal_recipe_ID: string) {
        try {
            const result = await this.model.deleteOne({ personal_recipe_ID }).exec();
            if (result.deletedCount && result.deletedCount > 0) {
                response.json({ message: `Modified recipe ${personal_recipe_ID} deleted successfully.`, result });
            } else {
                response.status(404).json({ error: "Modified recipe not found" });
            }
        } catch (e) {
            console.error("Failed to delete modified recipe:", e);
            response.status(500).json({ error: "Failed to delete modified recipe" });
        }
    }

    /**
     * Saves a new version of the modified recipe.
     * Increments the version number and saves it as a new document.
     * @param modified_recipe - Object containing modified recipe details.
     * @returns Saved version of the modified recipe.
     */
    public async saveVersion(modified_recipe: IRecipe) {
        try {
            const currentVersion = modified_recipe.version_number || 1;
            const newVersion = { ...modified_recipe, version_number: currentVersion + 1 };
            const newRecipe = new this.model(newVersion);
            return await newRecipe.save();
        } catch (e) {
            console.error("Failed to save version of modified recipe:", e);
            throw e;
        }
    }

    /**
     * Adds notes to an existing modified recipe.
     * @param personal_recipe_ID - The unique ID of the modified recipe.
     * @param note - The note to add.
     * @param response - Response object to send the updated document.
     */
    public async addNotes(response: any, personal_recipe_ID: string, note: string) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_ID: personal_recipe_ID },
                { $set: { notes: note } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Modified recipe not found" });
            }
        } catch (e) {
            console.error("Failed to add notes to modified recipe:", e);
            response.status(500).json({ error: "Failed to add notes to modified recipe" });
        }
    }

    /**
     * Updates the `category` of a modified recipe by `personal_recipe_ID`.
     * @param response - The response object to send data back to the client.
     * @param personal_recipe_ID
     * @param category - An array of category tags for the recipe.
     * @returns void - Sends the updated recipe in JSON format.
     */
    public async updateCategory(response: any, personal_recipe_ID: string, category: string[]) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_ID: personal_recipe_ID },
                { $set: { category } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Modified recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update category:", e);
            response.status(500).json({ error: "Failed to update category" });
        }
    }

    /**
     * Updates the `imageUrl` of a modified recipe by `personal_recipe_ID`.
     * @param response - The response object to send data back to the client.
     * @param personal_recipe_ID
     * @param image_url
     * @returns void - Sends the updated recipe in JSON format.
     */
    public async updateImageURL(response: any, personal_recipe_ID: string, image_url: string) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_ID: personal_recipe_ID },
                { $set: { image_url: image_url } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Modified recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update image URL:", e);
            response.status(500).json({ error: "Failed to update image URL" });
        }
    }

    /**
     * Updates the `isVisible` field of a modified recipe by `personal_recipe_ID`.
     * @param response - The response object to send data back to the client.
     * @param personal_recipe_ID
     * @param is_visible
     * @returns void - Sends the updated recipe in JSON format.
     */
    public async updateVisibility(response: any, personal_recipe_ID: string, is_visible: boolean) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_ID: personal_recipe_ID },
                { $set: { isVisible: is_visible } },
                { new: true, runValidators: true }
            ).exec();
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Modified recipe not found" });
            }
        } catch (e) {
            console.error("Failed to update visibility:", e);
            response.status(500).json({ error: "Failed to update visibility" });
        }
    }
}

export { ModifiedRecipeModel };
