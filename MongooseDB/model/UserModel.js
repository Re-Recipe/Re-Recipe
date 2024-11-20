"use strict";
/**
* Some methods for a potential UserModel.
* We might want to clarify and change this what is in this file.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose = require("mongoose");
class UserModel {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param DB_CONNECTION_STRING - Connection string for MongoDB.
     */
    constructor(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    /**
     * Creates the Mongoose schema for a user.
     * Defines the structure for `user_ID`, `username`, `email`, `password`, `createdAt`, and `recipes`.
     */
    createSchema() {
        this.schema = new mongoose.Schema({
            user_ID: { type: String, required: true, unique: true }, // unique identifier for the user
            username: { type: String, required: true, unique: true }, // username of the user
            email: { type: String, required: true, unique: true }, // email address of the user
            password: { type: String, required: true }, // hashed password
            createdAt: { type: Date, default: Date.now }, // account creation date
            recipeIds: [
                { type: mongoose.Schema.Types.ObjectId, ref: "RecipeList" }
            ]
        }, { collection: 'users' });
    }
    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     * The model is stored in `this.model`.
     * @returns void
     */
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose.connect(this.dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
                this.model = mongoose.model("User", this.schema);
            }
            catch (e) {
                console.error("Failed to connect to the database:", e);
            }
        });
    }
    /**
     * Retrieves all users from the database.
     * @param response - The response object to send data back to the client.
     * @returns void - Sends a JSON array of all users in the response.
     */
    retrieveAllUsers(response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.model.find({}).exec();
                response.json(users);
            }
            catch (e) {
                console.error("Failed to retrieve users:", e);
                response.status(500).json({ error: "Failed to retrieve users" });
            }
        });
    }
    /**
     * Retrieves a single user by `user_ID`.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user to retrieve.
     * @returns void - Sends a JSON object of the found user or an error if not found.
     */
    retrieveUser(response, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findOne({ user_ID: userId }).exec();
                response.json(user);
            }
            catch (e) {
                console.error("Failed to retrieve user:", e);
                response.status(500).json({ error: "Failed to retrieve user" });
            }
        });
    }
    /**
     * Updates a user's email by `user_ID`.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user to update.
     * @param newEmail - The new email address for the user.
     * @returns void - Sends the updated user in JSON format.
     */
    updateEmail(response, userId, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.model.findOneAndUpdate({ user_ID: userId }, { $set: { email: newEmail } }, { new: true }).exec();
                response.json(updatedUser);
            }
            catch (e) {
                console.error("Failed to update email:", e);
                response.status(500).json({ error: "Failed to update email" });
            }
        });
    }
    /**
     * Updates a user's password by `user_ID`.
     * Note: Ensure password is hashed before updating.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user to update.
     * @param newPassword - The new hashed password for the user.
     * @returns void - Sends the updated user in JSON format.
     */
    updatePassword(response, userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.model.findOneAndUpdate({ user_ID: userId }, { $set: { password: newPassword } }, { new: true }).exec();
                response.json(updatedUser);
            }
            catch (e) {
                console.error("Failed to update password:", e);
                response.status(500).json({ error: "Failed to update password" });
            }
        });
    }
    /**
     * Deletes a user by `user_ID`.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user to delete.
     * @returns void - Sends a success message with the deletion result.
     */
    deleteUser(response, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.deleteOne({ user_ID: userId }).exec();
                response.json({ message: `User ${userId} deleted`, result });
            }
            catch (e) {
                console.error("Failed to delete user:", e);
                response.status(500).json({ error: "Failed to delete user" });
            }
        });
    }
    /**
     * Adds a recipe to a user's recipe list by `user_ID`.
     * @param response - The response object to send data back to the client.
     * @param userId - The unique ID of the user.
     * @param recipeId - The ID of the recipe to add.
     * @returns void - Sends the updated user in JSON format.
     */
    addRecipeToUser(response, userId, recipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.model.findOneAndUpdate({ user_ID: userId }, { $push: { recipes: recipeId } }, { new: true }).exec();
                response.json(updatedUser);
            }
            catch (e) {
                console.error("Failed to add recipe to user:", e);
                response.status(500).json({ error: "Failed to add recipe to user" });
            }
        });
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map