import { Document } from "mongoose";

export interface IContents extends Document {
  cooking_duration: number;
  version_number: number;
  serving_size: number;
  ingredients: {
    ingredient_id?: string;
    name: string;
    unit: string;
  }[];
  directions: {
    step: string;
  }[];
  notes?: string;
}
