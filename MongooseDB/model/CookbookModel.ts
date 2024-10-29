import * as mongoose from "mongoose";

class CookbookModel {
    public schema: mongoose.Schema;
    public model: mongoose.Model<any>;
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
     * Defines the schema for a cookbook with a user reference and an array of recipes.
     * Each recipe entry tracks its ID and multiple version numbers independently.
     */
    public createSchema() {
        this.schema = new mongoose.Schema(
            {
                user_id: { type: String, required: true },
                recipes: [
                    {
                        recipe_id: { type: String, required: true },
                        versions: [
                            {
                                version_number: { type: Number, required: true },
                                notes: String, // Any additional metadata for the version
                                last_modified: { type: Date, default: Date.now }
                            }
                        ]
                    }
                ]
            },
            { collection: "cookbooks" }
        );
    }

    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     * @returns void
     */
    public async createModel() {
        try {
            await mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
            this.model = mongoose.model("Cookbook", this.schema);
        } catch (error) {
            console.error("Error creating model:", error);
        }
    }

    /**
     * Adds a new version of a recipe to the user's cookbook.
     * @param userId - ID of the user.
     * @param recipeId - ID of the recipe.
     * @param versionData - Metadata for the new version.
     * @param response - The response object to send data back to the client.
     */
    public async addRecipeVersion(response: any, userId: string, recipeId: string, versionData: any) {
        try {
            const result = await this.model.findOneAndUpdate(
                { user_id: userId, "recipes.recipe_id": recipeId },
                { $push: { "recipes.$.versions": versionData } },
                { new: true, upsert: true }
            ).exec();
            response.json(result);
        } catch (error) {
            console.error("Failed to add recipe version:", error);
            response.status(500).json({ error: "Failed to add recipe version" });
        }
    }

    /**
     * Retrieves specific or all versions of a recipe by `recipe_id`.
     * @param userId - ID of the user.
     * @param recipeId - The ID of the recipe.
     * @param versionNumber - (Optional) The specific version number to retrieve.
     * @param response - The response object to send data back to the client.
     */
    public async retrieveRecipeVersion(response: any, userId: string, recipeId: string, versionNumber?: number) {
        try {
            const cookbook = await this.model.findOne({ user_id: userId, "recipes.recipe_id": recipeId }).exec();
            const recipe = cookbook?.recipes.find((r: any) => r.recipe_id === recipeId);

            if (recipe) {
                const result = versionNumber
                    ? recipe.versions.find((v: any) => v.version_number === versionNumber)
                    : recipe.versions;
                response.json(result);
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (error) {
            console.error("Failed to retrieve recipe version:", error);
            response.status(500).json({ error: "Failed to retrieve recipe version" });
        }
    }

    /**
     * Removes a recipe or a specific version of a recipe.
     * @param userId - ID of the user.
     * @param recipeId - The ID of the recipe.
     * @param versionNumber - (Optional) Version number to remove.
     * @param response - The response object to send data back to the client.
     */
    public async removeRecipeVersion(response: any, userId: string, recipeId: string, versionNumber?: number) {
        try {
            if (versionNumber) {
                // Remove specific version
                const result = await this.model.updateOne(
                    { user_id: userId, "recipes.recipe_id": recipeId },
                    { $pull: { "recipes.$.versions": { version_number: versionNumber } } }
                ).exec();
                response.json({ message: `Version ${versionNumber} removed from recipe ${recipeId}`, result });
            } else {
                // Remove entire recipe entry
                const result = await this.model.updateOne(
                    { user_id: userId },
                    { $pull: { recipes: { recipe_id: recipeId } } }
                ).exec();
                response.json({ message: `Recipe ${recipeId} and all versions removed`, result });
            }
        } catch (error) {
            console.error("Failed to remove recipe/version:", error);
            response.status(500).json({ error: "Failed to remove recipe/version" });
        }
    }

    /**
     * Compares two versions of a recipe by version number.
     * @param userId - ID of the user.
     * @param recipeId - The ID of the recipe.
     * @param version1 - The first version number to compare.
     * @param version2 - The second version number to compare.
     * @param response - The response object to send data back to the client.
     */
    public async compareRecipeVersions(response: any, userId: string, recipeId: string, version1: number, version2: number) {
        try {
            const cookbook = await this.model.findOne({ user_id: userId, "recipes.recipe_id": recipeId }).exec();
            const recipe = cookbook?.recipes.find((r: any) => r.recipe_id === recipeId);

            if (recipe) {
                const ver1 = recipe.versions.find((v: any) => v.version_number === version1);
                const ver2 = recipe.versions.find((v: any) => v.version_number === version2);

                if (ver1 && ver2) {
                    response.json({ version1: ver1, version2: ver2 });
                } else {
                    response.status(404).json({ error: "One or both versions not found" });
                }
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (error) {
            console.error("Failed to compare recipe versions:", error);
            response.status(500).json({ error: "Failed to compare recipe versions" });
        }
    }
}

export { CookbookModel };
