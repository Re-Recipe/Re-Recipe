import { Document } from 'mongoose';
import { EnumType } from 'typescript';
import { IContents } from './IContents.model';

export interface IRecipe extends Document {
  modified_flag: boolean;
  user_ID: string;
  recipe_ID: string;
  recipe_name: string;
  meal_category: [EnumType];
  recipe_versions: [IContents]; // THESE ARE THE RECIPE CONTENTS OBJECTS
  image_url?: string;
  is_visible?: boolean;
}
