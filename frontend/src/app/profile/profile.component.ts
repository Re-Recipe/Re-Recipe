import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeservicesService } from '../../recipeservices.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any;

  constructor(
    private recipeService: RecipeservicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (!isAuthenticated) {
        this.user = null;
        this.router.navigate(['/login']); // Redirect if logged out
      }
    });
    this.recipeService.userProfile().subscribe(
      (data: { name: string; email: string }) => {
        this.user = data;
        console.log('User Profile:', data);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  login(): void {
    this.recipeService.login();
  }
}