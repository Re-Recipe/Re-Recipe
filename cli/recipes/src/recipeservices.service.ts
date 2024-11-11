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
  getRecipes(): Observable<IRecipe[]> {
    return this.http.get<IRecipe[]>(`${this.hostUrl}` + 'recipes');
  }

  getRecipeByID(recipeID: string): Observable<IRecipe> {
    return this.http.get<IRecipe>(`${this.hostUrl}`+ `recipes/`+`${recipeID}`);
}

}
