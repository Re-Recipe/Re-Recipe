import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeVersionsComponent } from './recipe-versions.component';

describe('RecipeVersionsComponent', () => {
  let component: RecipeVersionsComponent;
  let fixture: ComponentFixture<RecipeVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeVersionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
