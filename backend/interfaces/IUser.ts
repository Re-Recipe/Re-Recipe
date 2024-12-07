import Mongoose = require("mongoose");

interface IUser extends Mongoose.Document {
  user_ID: string; // System generated & unique user ID
  username: string; // Unique username, system-generated
  email: string; // User's email address
  password: string; // Hashed password
  createdAt?: Date; // Optional if timestamps are auto-managed
  hints?: string; // Optional hints for the user
  recipeIDs: Mongoose.Types.ObjectId[]; // Array of ObjectIds referencing Recipe model
}

export { IUser };
