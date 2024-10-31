import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginalrecipeComponent } from './originalrecipe.component';

describe('OriginalrecipeComponent', () => {
  let component: OriginalrecipeComponent;
  let fixture: ComponentFixture<OriginalrecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginalrecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginalrecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
