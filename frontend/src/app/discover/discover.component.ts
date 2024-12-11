import { Component, OnInit } from "@angular/core";
import { RecipeservicesService } from "../../recipeservices.service";
import { IRecipe } from "../model/IRecipe";
import { IRecipeContents } from "../model/IRecipeContents";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css', ]
  
})
export class DiscoverComponent implements OnInit {
  recipeList: IRecipe[] = [];
  recipeListContents: IRecipeContents[] = []
  selectedRecipes: Set<string> = new Set(); // Track selected recipes by their IDs
  loading: boolean = true;
  error: string | null = null;
  searchQuery: string = '';
  selectedCategory: string = '';
  maxCookingDuration: number | null = null;
  userId: any;

  constructor(private recipeService: RecipeservicesService) {}

  ngOnInit(): void {
    this.getRecipes();
  }

  getRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (data) => {

        this.recipeList = data;

        
        console.log(this.recipeList)

        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load recipes.';
        this.loading = false;
      }
    );
  }

  get uniqueCategories(): string[] {
    const categories = this.recipeList.flatMap((recipe) => recipe.meal_category || []);
    return Array.from(new Set(categories)).sort();
  }

  filteredRecipes(): IRecipe[] {
    return this.recipeList.filter((recipe) => {
      const matchesSearch = recipe.recipe_name?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory
        ? recipe.meal_category?.some((category) => category === this.selectedCategory)
        : true;
      
      return matchesSearch && matchesCategory;
    });
  } 

  toggleRecipeSelection(recipeId: string): void {
    if (this.selectedRecipes.has(recipeId)) {
      this.selectedRecipes.delete(recipeId); // Remove from selection
    } else {
      this.selectedRecipes.add(recipeId); // Add to selection
    }
  }

  saveSelectedRecipes(): void {
    this.recipeService.userProfile().subscribe(
      (userProfile) => {
        const userId = userProfile.user_id;  // Adjust to match your backend's property naming
        console.log("Fetched user ID:", userId);
  
        if (!userId) {
          console.error("User ID is missing from user profile.");
          return;
        }
  
        const selectedRecipeList = this.recipeList
          .filter(recipe => this.selectedRecipes.has(recipe.recipe_ID))  // Filter selected recipes
          .map(recipe => ({
            ...recipe,
            user_ID: userId  // Add user_ID to each recipe
          }));
  
        console.log("Selected recipes to save:", selectedRecipeList);
  
        if (selectedRecipeList.length === 0) {
          console.warn("No recipes selected to save.");
          return;
        }
  
        this.recipeService.addRecipesToCookbook(selectedRecipeList).subscribe(
          (response) => {
            console.log('Recipes added to cookbook successfully:', response);
            // Update UI or show success message
          },
          (error) => {
            console.error('Error adding recipes to cookbook:', error);
            // Display appropriate error message to the user
          }
        );
      },
      (error: any) => {
        console.error('Error fetching user profile:', error);
        // Handle user profile fetch failure
      }
    );
  }
   
}