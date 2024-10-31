import * as mongoose from "mongoose";
import { IModifiedRecipeModel } from '../interfaces/IModifiedRecipeModel';

class ModifiedRecipeModel {
    public schema: mongoose.Schema<IModifiedRecipeModel>;
    public model: mongoose.Model<IModifiedRecipeModel>;
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
        const schemaDefinition: mongoose.SchemaDefinition<IModifiedRecipeModel> = {
            user_id: { type: String, required: true },
            recipe_id: { type: String, required: true },
            personal_recipe_id: { type: String, unique: true, required: true },
            category: [{
                type: String,
                enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'vegan', 'gluten-free'],
                required: true,
            }],
            ingredients: [{
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                unit: { type: String, enum: ['oz', 'cup', 'tbsp', 'tsp', 'g', 'kg', 'lb', 'each'], required: true }
            }],
            directions: [{
                step: { type: String, required: true }
            }],
            notes: { type: String },
            version_number: { type: Number, default: 1, required: true },
            image_URL: { type: String },
            cooking_duration: { type: Number, required: true },
            is_Visible: { type: Boolean, default: false }
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
            this.model = mongoose.model<IModifiedRecipeModel>("ModifiedRecipe", this.schema);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Adds a new modified recipe.
     * @param modifiedRecipe - Object containing modified recipe details.
     * @returns The saved modified recipe document.
     */
    public async createModifiedRecipe(modifiedRecipe: IModifiedRecipeModel) {
        const newRecipe = new this.model(modifiedRecipe);
        return await newRecipe.save();
    }

    /**
     * Retrieves a modified recipe by `personal_recipe_id`.
     * @param personalRecipeId - The unique ID of the modified recipe.
     * @param response - Response object to send data back to the client.
     */
    public async retrieveModifiedRecipe(response: any, personalRecipeId: string) {
        try {
            const result = await this.model.findOne({ personal_recipe_id: personalRecipeId }).exec();
            response.json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to retrieve modified recipe" });
        }
    }

    /**
     * Updates the ingredients of a modified recipe by `personal_recipe_id`.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param newIngredients - Updated ingredients array.
     * @param response - Response object to send updated data.
     */
    public async updateRecipeIngredients(response: any, personalRecipeID: string, newIngredients: string[]) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_id: personalRecipeID },
                { $set: { ingredients: newIngredients } },
                { new: true }
            ).exec();
            response.json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to update ingredients" });
        }
    }

    /**
     * Updates the directions of a modified recipe by `personal_recipe_id`.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param newDirections - Updated directions array.
     * @param response - Response object to send updated data.
     */
    public async updateRecipeDirections(response: any, personalRecipeID: string, newDirections: string[]) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_id: personalRecipeID },
                { $set: { directions: newDirections } },
                { new: true }
            ).exec();
            response.json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to update directions" });
        }
    }

    /**
     * Deletes a modified recipe by its `personal_recipe_id`.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param response - Response object to send deletion result.
     */
    public async deleteModifiedRecipe(response: any, personalRecipeID: string) {
        try {
            const result = await this.model.deleteOne({ personal_recipe_id: personalRecipeID }).exec();
            response.json({ message: `Modified recipe ${personalRecipeID} deleted`, result });
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to delete modified recipe" });
        }
    }

    /**
     * Saves a new version of the modified recipe.
     * Increments the version number and saves it as a new document.
     * @param modifiedRecipe - Object containing modified recipe details.
     * @returns Saved version of the modified recipe.
     */
    public async saveVersion(modifiedRecipe: IModifiedRecipeModel) {
        const newVersion = { ...modifiedRecipe, version_number: modifiedRecipe.version_number + 1 };
        const newRecipe = new this.model(newVersion);
        return await newRecipe.save();
    }

    /**
     * Adds notes to an existing modified recipe.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param note - The note to add.
     * @param response - Response object to send the updated document.
     */
    public async addNotes(response: any, personalRecipeID: string, note: string) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_id: personalRecipeID },
                { $set: { notes: note } },
                { new: true }
            ).exec();
            response.json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to add notes to modified recipe" });
        }
    }

    /**
     * Updates the `category` of a modified recipe by `personal_recipe_id`.
     * @param response - The response object to send data back to the client.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param category - An array of category tags for the recipe.
     * @returns void - Sends the updated recipe in JSON format.
     */
    public async updateCategory(response: any, personalRecipeID: string, category: string[]) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_id: personalRecipeID },
                { $set: { category } },
                { new: true }
            ).exec();
            response.json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to update category" });
        }
    }

    /**
     * Updates the `image_URL` of a modified recipe by `personal_recipe_id`.
     * @param response - The response object to send data back to the client.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param imageURL - The new image URL for the recipe.
     * @returns void - Sends the updated recipe in JSON format.
     */
    public async updateImageURL(response: any, personalRecipeID: string, imageURL: string) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_id: personalRecipeID },
                { $set: { image_URL: imageURL } },
                { new: true }
            ).exec();
            response.json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to update image URL" });
        }
    }

    /**
     * Updates the `is_Visible` field of a modified recipe by `personal_recipe_id`.
     * @param response - The response object to send data back to the client.
     * @param personalRecipeID - The unique ID of the modified recipe.
     * @param isVisible - Boolean indicating if the recipe should be visible.
     * @returns void - Sends the updated recipe in JSON format.
     */
    public async updateVisibility(response: any, personalRecipeID: string, isVisible: boolean) {
        try {
            const result = await this.model.findOneAndUpdate(
                { personal_recipe_id: personalRecipeID },
                { $set: { is_Visible: isVisible } },
                { new: true }
            ).exec();
            response.json(result);
        } catch (e) {
            console.error(e);
            response.status(500).json({ error: "Failed to update visibility" });
        }
    }


}


export { ModifiedRecipeModel };
