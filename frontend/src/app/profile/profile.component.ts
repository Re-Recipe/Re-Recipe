import { Component } from '@angular/core';
import { RecipeservicesService } from '../../recipeservices.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any;
  constructor(private recipeService: RecipeservicesService){}
  ngOnInit(): void {
    this.recipeService.userProfile().subscribe(
      (data: { name: string; email: string }) => { // Ensure the type matches the API response
       this.user = data
        console.log('User Profile:', data);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
}
