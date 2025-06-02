import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentlistnumberedComponent } from './contentlistnumbered.component';

describe('ContentlistnumberedComponent', () => {
  let component: ContentlistnumberedComponent;
  let fixture: ComponentFixture<ContentlistnumberedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentlistnumberedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentlistnumberedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
