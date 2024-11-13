import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IRecipe } from './app/model/IRecipe.model';
@Injectable({
  providedIn: 'root'
})
export class RecipeservicesService {
  hostUrl:string = "http://localhost:8080/app/"
  constructor(private http:HttpClient) { }

 /*
 * Below are the CRUD operations for manipulating recipe data.
 * These operations include creating, reading, updating, and deleting recipes
 * and are used to interact with the backend database.
 * 
 * TODO: Missing granular recipe updates (directions, ingredients, image URL, 
 *       visibility).
 * TODO: Add a method to retrieve the total count of recipes in the database.
 */


  // Get all recipes 
  getRecipes(): Observable<IRecipe[]> {
    return this.http.get<IRecipe[]>(`${this.hostUrl}` + 'recipes');
  }
  
  // Get recipe by ID
  getRecipeByID(recipeID: string): Observable<IRecipe> {
    return this.http.get<IRecipe>(`${this.hostUrl}`+ `recipes/`+`${recipeID}`);
  }

  // Update recipe by ID (recipe = new data replacing)
  updateRecipe(recipeID: string, recipe: IRecipe): Observable<IRecipe> {
    return this.http.put<IRecipe>(`${this.hostUrl}recipes/${recipeID}`, recipe);
  }

  // Add (Create) a new recipe
  addRecipe(recipe: IRecipe): Observable<IRecipe> {
    return this.http.post<IRecipe>(`${this.hostUrl}recipes`, recipe);
  }

  // Delete a recipe
  deleteRecipe(recipeID: string): Observable<void> {
    return this.http.delete<void>(`${this.hostUrl}recipes/${recipeID}`);
  }

}