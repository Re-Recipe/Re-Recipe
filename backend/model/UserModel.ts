import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import { CookbookModel } from "./CookbookModel";

class UserModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<any>;
  public dbConnectionString: string;
  private cookbookModel: CookbookModel;

  constructor(DB_CONNECTION_STRING: string, cookbookModel: CookbookModel) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.cookbookModel = cookbookModel; // Use the passed instance
    this.createSchema();
    this.createModel();
  }

  private createSchema() {
    this.schema = new mongoose.Schema(
        {
          user_ID: { type: String, required: true, unique: true },
          email: { type: String, required: true, unique: true },
          displayName: { type: String, required: true },
          color: { type: String, required: true, default: "#000000" },
        },
        { collection: "users", timestamps: true }
    );
  }

  private async createModel() {
    try {
      if (!mongoose.connection.readyState) {
        await mongoose.connect(this.dbConnectionString);
      }
      this.model = mongoose.model("User", this.schema);
      console.log("Connected to MongoDB and created User model.");
    } catch (error) {
      console.error("Error creating User model:", error);
    }
  }

  private async ensureCookbookExists(userId: string): Promise<void> {
    const cookbookExists = await this.cookbookModel.model
        .findOne({ user_ID: userId })
        .exec();
    if (!cookbookExists) {
      console.log(`No cookbook found for user_ID: ${userId}. Creating one.`);
      await this.cookbookModel.createCookbook(userId);
    } else {
      console.log(`Cookbook already exists for user_ID: ${userId}`);
    }
  }

  public async createUser(userData: Partial<IUser>): Promise<mongoose.Document> {
    try {
      console.log("Creating new user with data:", userData);

      const newUser = new this.model({
        user_ID: userData.user_ID,
        email: userData.email,
        displayName: userData.displayName,
      });

      const savedUser = await newUser.save();
      console.log("New user created:", savedUser);

      await this.ensureCookbookExists(savedUser.user_ID);

      return savedUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("User creation failed.");
    }
  }


  public async findOrCreateUser(userData: Partial<IUser>): Promise<mongoose.Document> {
    try {
      console.log("Finding or creating user with data:", userData);

      let user = await this.model.findOne({ user_ID: userData.user_ID }).exec();

      if (!user) {
        console.log("User not found. Creating new user.");
        user = await this.createUser(userData);
      } else {
        console.log("User already exists:", user);
      }

      console.log(`Ensuring cookbook exists for user_ID: ${user.user_ID}`);
      await this.ensureCookbookExists(user.user_ID);

      return user;
    } catch (error) {
      console.error("Error during find or create user:", error);
      throw new Error("User lookup or creation failed.");
    }
  }


  public async updateUser(userId: string, updateData: Partial<IUser>): Promise<mongoose.Document | null> {
    try {
      console.log("Updating user:", userId, "with data:", updateData);

      const updatedUser = await this.model
          .findOneAndUpdate({ user_ID: userId }, updateData, { new: true })
          .exec();

      if (!updatedUser) {
        console.error("User not found for update.");
        return null;
      }

      console.log("User updated:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Error updating user profile.");
    }
  }

  public async deleteUser(userId: string): Promise<boolean> {
    try {
      console.log("Deleting user with ID:", userId);

      const result = await this.model.deleteOne({ user_ID: userId }).exec();

      if (result.deletedCount === 0) {
        console.error("User not found for deletion.");
        return false;
      }

      console.log("User deleted successfully.");
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Error deleting user.");
    }
  }

  public async listAllUsers(): Promise<mongoose.Document[]> {
    try {
      console.log("Listing all users.");
      return await this.model.find({}).exec();
    } catch (error) {
      console.error("Error listing users:", error);
      throw new Error("Error retrieving user list.");
    }
  }

  public async getUserProfile(userId: string): Promise<mongoose.Document | null> {
    try {
      console.log("Fetching user profile for ID:", userId);
      return await this.model
          .findOne({ user_ID: userId })
          .select("displayName email user_ID color")
          .exec();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("User profile fetch failed.");
    }
  }

}

export { UserModel };