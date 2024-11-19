import * as mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [
      "breakfast",
      "lunch",
      "dinner",
      "dessert",
      "vegetarian",
      "vegan",
      "gluten-free",
    ],
    required: true,
  },
});

export const Category = mongoose.model("Category", categorySchema);
