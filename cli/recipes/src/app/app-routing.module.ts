import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiscoverComponent } from './discover/discover.component';
import { CreaterecipeComponent } from './createrecipe/createrecipe.component';
import { CookbookComponent } from './cookbook/cookbook.component';
const routes: Routes = [
  { path: '', component:  DiscoverComponent},
  { path: 'recipes', component:  DiscoverComponent},
  { path: 'createrecipe', component: CreaterecipeComponent},
  {path: 'cookbook',component:CookbookComponent}
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
