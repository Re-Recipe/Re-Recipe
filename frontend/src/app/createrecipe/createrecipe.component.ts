import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RecipeservicesService } from '../../recipeservices.service';

@Component({
  selector: 'app-createrecipe',
  templateUrl: './createrecipe.component.html',
  styleUrls: ['./createrecipe.component.css']
})
export class CreaterecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  categories: string[] = ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'vegan', 'gluten-free'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, // Keep HttpClient for direct API calls if needed
    private recipeService: RecipeservicesService // Use the service for modular recipe-related API calls
  ) {}

  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      recipe_name: ['', Validators.required],
      category: ['', Validators.required],
      cooking_duration: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      ingredients: this.fb.array([], this.minimumOneItemValidator),
      directions: this.fb.array([], this.minimumOneItemValidator),
      image_url: [''],
      is_visible: [false]
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get directions(): FormArray {
    return this.recipeForm.get('directions') as FormArray;
  }

  minimumOneItemValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return (control as FormArray).length > 0 ? null : { required: true };
  }

  addIngredient(): void {
    this.ingredients.push(
      this.fb.group({
        name: ['', Validators.required],
        quantity: [null, [Validators.required, Validators.min(1)]],
        unit: ['', Validators.required]
      })
    );
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  addDirection(): void {
    this.directions.push(
      this.fb.group({
        step: ['', Validators.required]
      })
    );
  }

  removeDirection(index: number): void {
    this.directions.removeAt(index);
  }

  /**
   * Submits the recipe form using the RecipeservicesService
   */
  onSubmit(): void {
    if (this.recipeForm.valid) {
      // Use RecipeservicesService for submitting the recipe
      this.recipeService.addRecipe(this.recipeForm.value).subscribe({
        next: (response) => {
          console.log('Recipe submitted successfully:', response);
          this.recipeForm.reset();
          this.ingredients.clear();
          this.directions.clear();
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
   * Example of making a direct API call using HttpClient
   */
  makeDirectApiCall(): void {
    this.http.get('/api/some-other-endpoint').subscribe({
      next: (response) => {
        console.log('Direct API response:', response);
      },
      error: (error) => {
        console.error('Error during direct API call:', error);
      }
    });
  }

  onReset(): void {
    this.recipeForm.reset({
      recipe_name: '',
      category: '',
      cooking_duration: null,
      image_url: '',
      is_visible: false
    });
    this.ingredients.clear();
    this.directions.clear();
  }
}