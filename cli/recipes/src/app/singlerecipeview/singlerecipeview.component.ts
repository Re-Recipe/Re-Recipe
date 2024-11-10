import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeservicesService } from '../../recipeservices.service';

@Component({
  selector: 'app-singlerecipeview',
  templateUrl: './singlerecipeview.component.html',
  styleUrl: './singlerecipeview.component.css'
})
export class SinglerecipeviewComponent {
  recipe: any;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeservicesService,
  ) {}

  ngOnInit(): void {
    const recipeID = this.route.snapshot.paramMap.get('recipeID');
    if (recipeID) {
      this.recipeService.getRecipeByID(recipeID).subscribe(
        (data) => this.recipe = data,
        (error) => console.error('Error fetching recipe', error)
      );
    }
  }
}
