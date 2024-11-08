import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RecipeservicesService } from '../../recipeservices.service';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent {
  title = 'recipes';
  constructor (private recipeService: RecipeservicesService){

  }

  recipeList: any = [];
  getRecipes(){
    this.recipeService.getRecipes().subscribe(data=>{
      this.recipeList = data;

    })
  }
ngOnInit(){
  this.getRecipes();
}
}
