export interface IRecipeContents extends Document {
    cooking_duration: number;
    version_number: number;
    serving_size: number;
    ingredients: {
      ingredient_id?: string;
      name: string;
      unit: string;
      quantity: Number;
    }[];
    directions: {
      step: string;
    }[];
    notes?: string;
  }