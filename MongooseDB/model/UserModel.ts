/**
* Some methods for a potential UserModel. 
* We might want to clarify and change this what is in this file. 
*/

import * as mongoose from "mongoose";
import { IUserModel } from '../interfaces/IUserModel';

class UserModel {
    public schema: any;
    public model: any;
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
     * Creates the Mongoose schema for a user.
     * Defines the structure for `user_ID`, `username`, `email`, `password`, `createdAt`, and `recipes`.
     */
    public createSchema() {
        this.schema = new mongoose.Schema(
            {
                user_ID: { type: String, required: true, unique: true }, // unique identifier for the user
                username: { type: String, required: true, unique: true }, // username of the user
                email: { type: String, required: true, unique: true }, // email address of the user
                password: { type: String, required: true }, // hashed password
                createdAt: { type: Date, default: Date.now }, // account creation date
                recipeIds: [ // array of recipe IDs associated with the user
                    { type: mongoose.Schema.Types.ObjectId, ref: "RecipeList" }
                ]
            },
            { collection: 'users' }
        );
    }

    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     * The model is stored in `this.model`.
     * @returns void
     */
    public async createModel() {
        try {
            await mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
            this.model = mongoose.model<IUserModel>("User", this.schema);
        } catch (e) {
            console.error("Failed to connect to the database:", e);
        }
    }

    /**
     * Retrieves all users from the database.
     * @param response - The response object to send data back to the client.
     * @returns void - Sends a JSON array of all users in the response.
     */
    public async retrieveAllUsers(response: any) {
        try {
            const users = await this.model.find({}).exec();
            response.json(users);
        } catch (e) {
            console.error("Failed to retrieve users:", e);
            response.status(500).json({ error: "Failed to retrieve users" });
        }
    }

    /**
     * Retrieves a single user by `user_ID`.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user to retrieve.
     * @returns void - Sends a JSON object of the found user or an error if not found.
     */
    public async retrieveUser(response: any, userId: string) {
        try {
            const user = await this.model.findOne({ user_ID: userId }).exec();
            response.json(user);
        } catch (e) {
            console.error("Failed to retrieve user:", e);
            response.status(500).json({ error: "Failed to retrieve user" });
        }
    }

    /**
     * Updates a user's email by `user_ID`.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user to update.
     * @param newEmail - The new email address for the user.
     * @returns void - Sends the updated user in JSON format.
     */
    public async updateEmail(response: any, userId: string, newEmail: string) {
        try {
            const updatedUser = await this.model.findOneAndUpdate(
                { user_ID: userId },
                { $set: { email: newEmail } },
                { new: true }
            ).exec();
            response.json(updatedUser);
        } catch (e) {
            console.error("Failed to update email:", e);
            response.status(500).json({ error: "Failed to update email" });
        }
    }

    /**
     * Updates a user's password by `user_ID`.
     * Note: Ensure password is hashed before updating.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user to update.
     * @param newPassword - The new hashed password for the user.
     * @returns void - Sends the updated user in JSON format.
     */
    public async updatePassword(response: any, userId: string, newPassword: string) {
        try {
            const updatedUser = await this.model.findOneAndUpdate(
                { user_ID: userId },
                { $set: { password: newPassword } },
                { new: true }
            ).exec();
            response.json(updatedUser);
        } catch (e) {
            console.error("Failed to update password:", e);
            response.status(500).json({ error: "Failed to update password" });
        }
    }

    /**
     * Deletes a user by `user_ID`.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user to delete.
     * @returns void - Sends a success message with the deletion result.
     */
    public async deleteUser(response: any, userId: string) {
        try {
            const result = await this.model.deleteOne({ user_ID: userId }).exec();
            response.json({ message: `User ${userId} deleted`, result });
        } catch (e) {
            console.error("Failed to delete user:", e);
            response.status(500).json({ error: "Failed to delete user" });
        }
    }

    /**
     * Adds a recipe to a user's recipe list by `user_ID`.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user.
     * @param recipeId - The ID of the recipe to add.
     * @returns void - Sends the updated user in JSON format.
     */
    public async addRecipeToUser(response: any, userId: string, recipeId: string) {
        try {
            const updatedUser = await this.model.findOneAndUpdate(
                { user_ID: userId },
                { $push: { recipes: recipeId } },
                { new: true }
            ).exec();
            response.json(updatedUser);
        } catch (e) {
            console.error("Failed to add recipe to user:", e);
            response.status(500).json({ error: "Failed to add recipe to user" });
        }
    }
}

export { UserModel };