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
  recipeList_1: IRecipe[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchQuery: string = '';

  constructor(private recipeService: RecipeservicesService) {}

  ngOnInit(): void {
    this.getRecipes();
    this.getRecipes_1();
  }

  getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (data) => {
        console.log('Fetched recipes:', data);
        this.recipeList = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching recipes:', error);
        this.error = 'Failed to load recipes.';
        this.loading = false;
      }
    );
  }

  getRecipes_1(): void {
    this.recipeService.getRecipes_1().subscribe(
      (data: any) => {
        console.log('Fetched additional recipes:', data);
        this.recipeList_1 = data.map((recipe: any) => ({
          ...recipe,
          recipe_versions: recipe.recipe_versions || [],
          meal_category: recipe.meal_category || [],
          image_url: recipe.image_url || 'assets/placeholder.png',
        }));
      },
      (error) => {
        console.error('Error fetching additional recipes:', error);
        this.error = 'Failed to load additional recipes.';
      }
    );
  }

  filteredRecipes(): IRecipe[] {
    return this.recipeList.filter((recipe) =>
      recipe.recipe_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
