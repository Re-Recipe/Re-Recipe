"use strict";
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
const crypto = require("crypto");
class UserModel {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param {string} DB_CONNECTION_STRING - MongoDB connection string.
     */
    constructor(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    /**
     * Defines the schema for a user.
     */
    createSchema() {
        this.schema = new mongoose.Schema({
            user_ID: { type: String, required: true, unique: true },
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true }, // Stores hashed password
            hints: { type: String }, // Optional field
            recipeIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
        }, { collection: "users", timestamps: true });
        // Pre-save hook to hash the password
        this.schema.pre("save", function (next) {
            const user = this;
            // Only hash the password if it's new or modified
            if (!user.isModified("password"))
                return next();
            try {
                user.password = UserModel.hashPW(user.password); // Hash the password
                next();
            }
            catch (err) {
                next(err);
            }
        });
    }
    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     */
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose.connect(this.dbConnectionString);
                this.model = mongoose.model("User", this.schema);
                console.log("Connected to MongoDB and created User model.");
            }
            catch (error) {
                console.error("Error creating User model:", error);
            }
        });
    }
    /**
     * Hashes a password using the crypto module.
     * @param {string} password - The plain text password to hash.
     * @returns {string} - The hashed password.
     */
    static hashPW(password) {
        return crypto.createHash("sha256").update(password).digest("base64").toString();
    }
    /**
     * Validates a user's password.
     * @param {string} inputPassword - The password provided by the user.
     * @param {string} storedPassword - The hashed password stored in the database.
     * @returns {boolean} - Whether the passwords match.
     */
    static validatePassword(inputPassword, storedPassword) {
        const hashedInput = UserModel.hashPW(inputPassword);
        return hashedInput === storedPassword;
    }
    /**
     * User Signup
     * @param {any} response - The response object.
     * @param {IUser} userData - The data for the new user.
     */
    signup(response, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                userData.password = UserModel.hashPW(userData.password);
                const newUser = new this.model(userData);
                const savedUser = yield newUser.save();
                response.status(201).json(savedUser);
            }
            catch (error) {
                console.error("Error signing up user:", error);
                response.status(400).json({ error: "Error creating user. Please try again." });
            }
        });
    }
    /**
     * User Login
     * @param {any} response - The response object.
     * @param {string} username - The username provided by the user.
     * @param {string} password - The password provided by the user.
     */
    login(response, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findOne({ username }).exec();
                if (!user) {
                    return response.status(404).json({ error: "User not found" });
                }
                const isPasswordValid = UserModel.validatePassword(password, user.password);
                if (!isPasswordValid) {
                    return response.status(401).json({ error: "Invalid credentials" });
                }
                // Successful login
                response.json({ message: "Login successful", user });
            }
            catch (error) {
                console.error("Error during login:", error);
                response.status(500).json({ error: "Error logging in. Please try again." });
            }
        });
    }
    /**
     * Get User Profile
     * @param {any} response - The response object.
     * @param {string} userId - The ID of the user to retrieve.
     */
    getUserProfile(response, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findOne({ user_ID: userId }).exec();
                if (!user) {
                    return response.status(404).json({ error: "User not found" });
                }
                response.json(user);
            }
            catch (error) {
                console.error("Error retrieving user profile:", error);
                response.status(500).json({ error: "Error retrieving profile. Please try again." });
            }
        });
    }
    /**
     * Update User Profile
     * @param {any} response - The response object.
     * @param {string} userId - The ID of the user to update.
     * @param {Partial<IUser>} updateData - The data to update.
     */
    updateUser(response, userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (updateData.password) {
                    updateData.password = UserModel.hashPW(updateData.password); // Hash the password if updated
                }
                const updatedUser = yield this.model.findOneAndUpdate({ user_ID: userId }, updateData, { new: true }).exec();
                if (!updatedUser) {
                    return response.status(404).json({ error: "User not found" });
                }
                response.json(updatedUser);
            }
            catch (error) {
                console.error("Error updating user:", error);
                response.status(500).json({ error: "Error updating profile. Please try again." });
            }
        });
    }
    /**
     * Delete User Profile
     * @param {any} response - The response object.
     * @param {string} userId - The ID of the user to delete.
     */
    deleteUser(response, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.deleteOne({ user_ID: userId }).exec();
                if (result.deletedCount === 0) {
                    return response.status(404).json({ error: "User not found" });
                }
                response.json({ message: "User deleted successfully" });
            }
            catch (error) {
                console.error("Error deleting user:", error);
                response.status(500).json({ error: "Error deleting profile. Please try again." });
            }
        });
    }
    /**
     * List All Users
     * @param {any} response - The response object.
     */
    listAllUsers(response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.model.find({}).exec();
                response.json(users);
            }
            catch (error) {
                console.error("Error listing users:", error);
                response.status(500).json({ error: "Error retrieving users. Please try again." });
            }
        });
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map