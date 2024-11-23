import * as mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import * as crypto from "crypto";

class UserModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<any>;
  public dbConnectionString: string;

  /**
   * Constructor to initialize the database connection and set up the schema and model.
   * @param {string} DB_CONNECTION_STRING - MongoDB connection string.
   */
  public constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.createSchema();
    this.createModel();
  }

  /**
   * Defines the schema for a user.
   */
  public createSchema() {
    this.schema = new mongoose.Schema(
      {
        user_ID: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // Stores hashed password
        hints: { type: String }, // Optional field
        recipeIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
      },
      { collection: "users", timestamps: true } // Enable automatic timestamps
    );

    // Pre-save hook to hash the password
    this.schema.pre("save", function (next) {
      const user = this as any;

      // Only hash the password if it's new or modified
      if (!user.isModified("password")) return next();

      try {
        user.password = UserModel.hashPW(user.password); // Use the hashPW function
        next();
      } catch (err) {
        next(err);
      }
    });
  }

  /**
   * Connects to the MongoDB database and creates the Mongoose model based on the schema.
   */
  public async createModel() {
    try {
      await mongoose.connect(this.dbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.model = mongoose.model("User", this.schema);
      console.log("Connected to MongoDB and created User model.");
    } catch (error) {
      console.error("Error creating User model:", error);
    }
  }

  /**
   * Hashes a password using the crypto module.
   * @param {string} password - The plain text password to hash.
   * @returns {string} - The hashed password.
   */
  public static hashPW(password: string): string {
    return crypto
      .createHash("sha256")
      .update(password)
      .digest("base64")
      .toString();
  }

  /**
   * Finds a user by their ID.
   * @param {string} userId - The ID of the user to find.
   * @returns {Promise<IUser | null>}
   */
  public async findUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await this.model.findOne({ user_ID: userId }).exec();
      return user;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  /**
   * Creates a new user.
   * @param {IUser} userData - The data for the new user.
   * @returns {Promise<IUser>}
   */
  public async createUser(userData: IUser): Promise<IUser> {
    try {
      // Hash the password before saving
      userData.password = UserModel.hashPW(userData.password);

      const newUser = new this.model(userData);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Updates a user's information.
   * @param {string} userId - The ID of the user to update.
   * @param {Partial<IUser>} updateData - The data to update.
   * @returns {Promise<IUser | null>}
   */
  public async updateUser(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      if (updateData.password) {
        // Hash the password if it's being updated
        updateData.password = UserModel.hashPW(updateData.password);
      }

      const updatedUser = await this.model
        .findOneAndUpdate({ user_ID: userId }, updateData, { new: true })
        .exec();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /**
   * Deletes a user by their ID.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<void>}
   */
  public async deleteUser(userId: string): Promise<void> {
    try {
      await this.model.deleteOne({ user_ID: userId }).exec();
      console.log(`User with ID ${userId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  /**
   * Lists all users in the database.
   * @returns {Promise<IUser[]>}
   */
  public async listAllUsers(): Promise<IUser[]> {
    try {
      const users = await this.model.find({}).exec();
      return users;
    } catch (error) {
      console.error("Error listing all users:", error);
      throw error;
    }
  }

  /**
   * Validates a user's password.
   * @param {string} inputPassword - The password provided by the user.
   * @param {string} storedPassword - The hashed password stored in the database.
   * @returns {boolean} - Whether the passwords match.
   */
  public static validatePassword(
    inputPassword: string,
    storedPassword: string
  ): boolean {
    const hashedInput = UserModel.hashPW(inputPassword);
    return hashedInput === storedPassword;
  }
}

export { UserModel };