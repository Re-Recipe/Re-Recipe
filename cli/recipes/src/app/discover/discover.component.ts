import { Component, OnInit } from '@angular/core';
import { RecipeservicesService } from '../../recipeservices.service';
import { IRecipe } from '../model/IRecipe';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  recipeList: IRecipe[] = [];
  loading: boolean = true;
  error: string | null = null;
  recipeList_1: IContents[] = [];
  searchQuery: string = '';

  constructor(private recipeService: RecipeservicesService) {}

  ngOnInit(): void {
    this.getRecipes();
  }

  getRecipes() {
    this.recipeService.getRecipes().subscribe(
      (data) => {
        console.log(data); // Inspect API response
        this.recipeList = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load recipes.';
        console.error(error);
        this.loading = false;
      }
    );
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