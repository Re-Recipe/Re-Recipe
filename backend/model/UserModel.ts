import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

class UserModel {
    public schema: mongoose.Schema;
    public model: mongoose.Model<any>;
    public dbConnectionString: string;

    constructor(DB_CONNECTION_STRING: string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema() {
        this.schema = new mongoose.Schema(
            {
                user_ID: { type: String, required: true, unique: true },
                email: { type: String, required: true, unique: true },
                color: { type: String, required: true },
                recipeIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
            },
            { collection: "users", timestamps: true }
        );
    }

    public async createModel() {
        try {
            await mongoose.connect(this.dbConnectionString);
            this.model = mongoose.model("User", this.schema);
            console.log("Connected to MongoDB and created User model.");
        } catch (error) {
            console.error("Error creating User model:", error);
        }
    }

    public async findOrCreateUser(response: any, userData: Partial<IUser>): Promise<void> {
        try {
            const user = await this.model.findOne({ email: userData.email }).exec();
            if (user) {
                response.json(user);
            } else {
                const newUser = new this.model(userData);
                const savedUser = await newUser.save();
                response.status(201).json(savedUser);
            }
        } catch (error) {
            console.error("Error during user lookup or creation:", error);
            response.status(500).json({ error: "Error processing user. Please try again." });
        }
    }

    public async getUserProfile(response: any, userId: string): Promise<void> {
        try {
            const user = await this.model.findOne({ user_ID: userId }).exec();
            if (!user) {
                return response.status(404).json({ error: "User not found" });
            }
            response.json(user);
        } catch (error) {
            console.error("Error retrieving user profile:", error);
            response.status(500).json({ error: "Error retrieving profile. Please try again." });
        }
    }

    public async updateUser(response: any, userId: string, updateData: Partial<IUser>): Promise<void> {
        try {
            const updatedUser = await this.model.findOneAndUpdate(
                { user_ID: userId },
                updateData,
                { new: true }
            ).exec();

            if (!updatedUser) {
                return response.status(404).json({ error: "User not found" });
            }

            response.json(updatedUser);
        } catch (error) {
            console.error("Error updating user:", error);
            response.status(500).json({ error: "Error updating profile. Please try again." });
        }
    }

    public async deleteUser(response: any, userId: string): Promise<void> {
        try {
            const result = await this.model.deleteOne({ user_ID: userId }).exec();
            if (result.deletedCount === 0) {
                return response.status(404).json({ error: "User not found" });
            }

            response.json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user:", error);
            response.status(500).json({ error: "Error deleting profile. Please try again." });
        }
    }

    public async listAllUsers(response: any): Promise<void> {
        try {
            const users = await this.model.find({}).exec();
            response.json(users);
        } catch (error) {
            console.error("Error listing users:", error);
            response.status(500).json({ error: "Error retrieving users. Please try again." });
        }
    }
}

export { UserModel };