import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-createrecipe',
  templateUrl: './createrecipe.component.html',
  styleUrls: ['./createrecipe.component.css']
})
export class CreaterecipeComponent implements OnInit {
  /** Form group for the recipe creation form */
  recipeForm!: FormGroup;

  /** Array of predefined categories for recipes */
  categories: string[] = ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'vegan', 'gluten-free'];

  /**
   * Constructs the CreaterecipeComponent and injects dependencies.
   * @param fb - Angular's FormBuilder service for reactive forms.
   * @param http - Angular's HttpClient service for HTTP requests.
   */
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  /**
   * Lifecycle hook that initializes the recipe creation form.
   */
  ngOnInit(): void {
    console.log('CreateRecipeComponent initialized');

    // Initialize the form group
    this.recipeForm = this.fb.group({
      recipe_name: ['', Validators.required],
      category: ['', Validators.required],
      cooking_duration: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      ingredients: this.fb.array([]), // Ingredients FormArray
      directions: this.fb.array([]), // Directions FormArray
      image_url: [''],
      is_visible: [false] // Checkbox for publishing
    });
  }

  /**
   * Getter for the `ingredients` FormArray.
   * @returns The FormArray containing all the ingredients.
   */
  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  /**
   * Getter for the `directions` FormArray.
   * @returns The FormArray containing all the directions.
   */
  get directions(): FormArray {
    return this.recipeForm.get('directions') as FormArray;
  }

  /**
   * Adds a new ingredient to the `ingredients` FormArray.
   */
  addIngredient(): void {
    this.ingredients.push(
      this.fb.group({
        name: ['', Validators.required],
        quantity: [null, [Validators.required, Validators.min(1)]],
        unit: ['', Validators.required]
      })
    );
  }

  /**
   * Removes an ingredient at the specified index from the `ingredients` FormArray.
   * @param index - The index of the ingredient to remove.
   */
  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  /**
   * Adds a new direction step to the `directions` FormArray.
   */
  addDirection(): void {
    this.directions.push(
      this.fb.group({
        step: ['', Validators.required]
      })
    );
  }

  /**
   * Removes a direction step at the specified index from the `directions` FormArray.
   * @param index - The index of the direction to remove.
   */
  removeDirection(index: number): void {
    this.directions.removeAt(index);
  }

  /**
   * Submits the form if it is valid. Sends a POST request to the API with the recipe data.
   */
  onSubmit(): void {
    if (this.recipeForm.valid) {
      console.log('Submitting Recipe:', this.recipeForm.value);
      this.http.post('/api/recipes', this.recipeForm.value).subscribe({
        next: (response) => {
          console.log('Recipe submitted successfully:', response);
          this.recipeForm.reset();
        },
        error: (error) => {
          console.error('Error submitting recipe:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  /**
   * Resets the form to its initial state and clears all ingredients and directions.
   */
  onReset(): void {
    console.log('onReset method called');

    // Reset the main form controls
    this.recipeForm.reset({
      recipe_name: '',
      category: '',
      cooking_duration: null,
      image_url: '',
      is_visible: false
    });

    // Clear the FormArrays (ingredients and directions)
    while (this.ingredients.length !== 0) {
      this.ingredients.removeAt(0);
    }

    while (this.directions.length !== 0) {
      this.directions.removeAt(0);
    }
  }
}
