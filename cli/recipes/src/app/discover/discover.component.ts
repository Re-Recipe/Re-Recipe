import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RecipeservicesService } from '../../recipeservices.service';
import { IRecipe } from '../model/IRecipe.model';
import { IContents } from '../model/IContents';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent {
  title = 'recipes';
  recipeList: IRecipe[] = [];
  recipeList_1: IContents[] = [];
  searchQuery: string = '';

  constructor(private recipeService: RecipeservicesService) {}

  getRecipes() {
    this.recipeService.getRecipes().subscribe(
      data => this.recipeList = data,
      error => console.error('Error fetching recipes:', error)
    );
  }

  getRecipes_1() {
    this.recipeService.getRecipes_1().subscribe(
      data => this.recipeList_1 = data,
      error => console.error('Error fetching recipes_1:', error)
    );
  }
  // Filter recipes based on the search query
  filteredRecipes() {
    return this.recipeList.filter(recipe => 
      recipe.recipe_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  ngOnInit() {
    this.getRecipes();
    this.getRecipes_1();
  }
}
