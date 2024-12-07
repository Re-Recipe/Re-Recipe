
import { Component } from '@angular/core';
import { RecipeservicesService } from '../recipeservices.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor (private recipeService: RecipeservicesService) {}
 
  login(): void {
    this.recipeService.Login();
}

}
