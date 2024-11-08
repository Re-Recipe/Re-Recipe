import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RecipeservicesService {
  hostUrl:string = "http://localhost:8080/app/"
  constructor(private http:HttpClient) { }
  getRecipes(): Observable<any> {
    return this.http.get(`${this.hostUrl}` + 'recipes');
  }
}
