import Mongoose = require("mongoose");

interface IUser extends Mongoose.Document {
  user_ID: string; // SSO ID
  email: string; // User's email address
  displayName: string;
  color: string;
}

export { IUser };
