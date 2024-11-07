// We might want to add or modify this schema 

import Mongoose = require("mongoose");

interface IUserModel extends Mongoose.Document {
    user_ID: string; 
    username: string; 
    email: string; 
    password: string; 
    createdAt: Date; 
    recipeIDs: Mongoose.Types.ObjectId[]; // array of recipe IDs associated with the user?
}

export { IUserModel };