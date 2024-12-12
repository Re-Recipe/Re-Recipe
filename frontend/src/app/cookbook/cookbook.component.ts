import { Component, OnInit } from '@angular/core';
import { RecipeservicesService } from '../../recipeservices.service';
import { IRecipe } from '../model/IRecipe';
@Component({
  selector: 'app-cookbook',
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.css'],
})
export class CookbookComponent implements OnInit {
  recipeList: IRecipe[] = [];
  recipeList_1: IRecipe[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchQuery: string = '';
  selectedCategory: string = '';
  maxCookingDuration: number | null = null;
  user_id: any;

  constructor(private recipeService: RecipeservicesService) {}

  ngOnInit(): void {
    this.getRecipes();

    this.getRecipeContent();
  }

  getRecipes(): void {
    this.recipeService.getAllCookbookRecipes().subscribe(
      (data) => {
        this.recipeList = data;
        this.loading = false;
        console.log("Cookbook, recipeservice..... front", this.recipeList)
      },
      (error) => {
        this.error = 'Failed to load recipes.';
        this.loading = false;
      }
    );
  }

  getRecipeContent(): void {
    this.recipeService.getRecipeContent().subscribe(
      (data: any) => {
        this.recipeList_1 = data.map((recipe: any) => ({
          ...recipe,
          recipe_versions: recipe.recipe_versions || [],
          meal_category: recipe.meal_category || [],
          image_url: recipe.image_url || 'assets/placeholder.png',
        }));
      },
      (error) => {
        this.error = 'Failed to load additional recipes.';
      }
    );
  }

  get uniqueCategories(): string[] {
    const categories = this.recipeList.flatMap(
      (recipe) => recipe.meal_category || []
    );
    return Array.from(new Set(categories)).sort();
  }

  filteredRecipes(): IRecipe[] {
    return this.recipeList.filter((recipe) => {
      const matchesSearch = recipe.recipe_name
        ?.toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory
        ? recipe.meal_category?.some(
            (category) => category === this.selectedCategory
          )
        : true;

      return matchesSearch && matchesCategory;
    });
  }
}