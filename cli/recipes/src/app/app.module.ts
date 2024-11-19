import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiscoverComponent } from './discover/discover.component';
import { CookbookComponent } from './cookbook/cookbook.component';
import { CreaterecipeComponent } from './createrecipe/createrecipe.component';
import { SinglerecipeviewComponent } from './singlerecipeview/singlerecipeview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent,
    CookbookComponent,
    CreaterecipeComponent,
    SinglerecipeviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, // Add ReactiveFormsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(), // Correct usage of provideHttpClient
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
