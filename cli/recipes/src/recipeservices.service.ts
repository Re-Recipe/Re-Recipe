import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRecipe } from './app/model/IRecipe';
import { IRecipeContents } from './app/model/IRecipeContents';
@Injectable({
  providedIn: 'root',
})
export class RecipeservicesService {
  hostUrl: string = 'http://localhost:8080/app/';

  constructor(private http: HttpClient) {}

  /**
   * ============================
   * Recipe CRUD Operations
   * ============================
   * These methods handle the main CRUD operations for recipe data,
   * including creating, reading, updating, and deleting recipes.
   */

  /**
   * Retrieves all recipes from the backend database.
   * @returns An Observable that emits an array of IRecipe objects.
   */
  getRecipes(): Observable<IRecipe[]> {
    return this.http.get<IRecipe[]>(`${this.hostUrl}discover`);
  }
  getRecipeContent(): Observable<IRecipeContents[]>{
    return this.http.get<IRecipeContents[]>(`${this.hostUrl}discover`);
  }

 
  /**
   * Retrieves a single recipe by its unique ID.
   * @param recipeID - The ID of the recipe to be retrieved.
   * @returns An Observable that emits the IRecipe object corresponding to the
   *          provided ID.
   */
  getRecipeByID(recipeID: string): Observable<IRecipe> {
    return this.http.get<IRecipe>(`${this.hostUrl}discover/${recipeID}`);
  }
  getRecipeContentByID(recipeID: string): Observable<IRecipeContents> {
    return this.http.get<IRecipeContents>(`${this.hostUrl}discover/${recipeID}`);
  }

  /**
   * Updates an existing recipe with new data.
   * @param recipeID - The ID of the recipe to be updated.
   * @param recipe - The updated IRecipe object containing new recipe data.
   * @returns An Observable that emits the updated IRecipe object.
   */
  updateRecipe(recipeID: string, recipe: IRecipe): Observable<IRecipe> {
    return this.http.put<IRecipe>(`${this.hostUrl}recipes/${recipeID}`, recipe);
  }

  /**
   * Adds a new recipe to the backend database.
   * @param recipe - The IRecipe object containing the details of the new
   *                 recipe.
   * @returns An Observable that emits the newly created IRecipe object.
   */
  addRecipe(recipe: IRecipe): Observable<IRecipe> {
    return this.http.post<IRecipe>(`${this.hostUrl}discover`, recipe);
  }

  /**
   * Deletes a recipe from the backend database.
   * @param recipeID - The ID of the recipe to be deleted.
   * @returns An Observable that completes when the recipe is successfully
   *          deleted.
   */
  deleteRecipe(recipeID: string): Observable<void> {
    return this.http.delete<void>(`${this.hostUrl}discover/${recipeID}`);
  }
  // /**
  //  * Updates the directions of a recipe.
  //  * @param recipeID - The ID of the recipe to be updated.
  //  * @param directions - An array of strings representing the new directions.
  //  * @returns An Observable that emits the updated IRecipe object.
  //  */
  // updateRecipeDirections(
  //   recipeID: string,
  //   directions: string[]
  // ): Observable<IRecipe> {
  //   return this.http.put<IRecipe>(
  //     `${this.hostUrl}recipes/${recipeID}/directions`,
  //     { directions }
  //   );
  // }

  // /**
  //  * Updates the ingredients of a recipe.
  //  * @param recipeID - The ID of the recipe to be updated.
  //  * @param ingredients - An array of objects containing `name`, `quantity`,
  //  *                      and `unit` for each ingredient.
  //  * @returns An Observable that emits the updated IRecipe object.
  //  */
  // updateRecipeIngredients(
  //   recipeID: string,
  //   ingredients: { name: string; quantity: number; unit: string }[]
  // ): Observable<IRecipe> {
  //   return this.http.put<IRecipe>(
  //     `${this.hostUrl}recipes/${recipeID}/ingredients`,
  //     { ingredients }
  //   );
  // }

  // /**
  //  * Updates the image URL of a recipe.
  //  * @param recipeID - The ID of the recipe to be updated.
  //  * @param imageUrl - The new image URL for the recipe.
  //  * @returns An Observable that emits the updated IRecipe object.
  //  */
  // updateRecipeImageUrl(
  //   recipeID: string,
  //   imageUrl: string
  // ): Observable<IRecipe> {
  //   return this.http.put<IRecipe>(
  //     `${this.hostUrl}recipes/${recipeID}/imageUrl`,
  //     { imageUrl }
  //   );
  // }

  /**
   * Updates the visibility status of a recipe.
   * @param recipeID - The ID of the recipe to be updated.
   * @param isVisible - A boolean indicating whether the recipe is visible or not.
   * @returns An Observable that emits the updated IRecipe object.
   */
  updateRecipeVisibility(
    recipeID: string,
    isVisible: boolean
  ): Observable<IRecipe> {
    return this.http.put<IRecipe>(
      `${this.hostUrl}discover/${recipeID}/visibility`,
      { isVisible }
    );
  }

  /**
   * ============================
   * Cookbook-Specific Operations
   * ============================
   * These methods are specifically for managing recipes in the user's
   * cookbook.
   */

  /**
   * Retrieves all recipes from the user's cookbook in the backend database.
   * @param userId - The ID of the user whose cookbook recipes are to be
   *                 retrieved.
   * @returns An Observable that emits an array of IRecipe objects from the
   *          user's cookbook.
   */
  getAllCookbookRecipes(userId: string): Observable<IRecipe[]> {
    return this.http.get<IRecipe[]>(`${this.hostUrl}listAllRecipes/${userId}`);
  }

  /**
   * Adds selected recipes to the user's cookbook in the backend database.
   * @param userId - The ID of the user whose cookbook is being updated.
   * @param recipeIds - An array of recipe IDs to be added to the cookbook.
   * @returns An Observable that emits the response from the backend.
   */
  addRecipesToCookbook(userId: string, recipeIds: string[]): Observable<any> {
    return this.http.post(`${this.hostUrl}cookbooks/${userId}`, { recipeIds });
  }
}