import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OriginalrecipeComponent } from './originalrecipe/originalrecipe.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,OriginalrecipeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cook';
}
