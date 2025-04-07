import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecksliderComponent } from './checkslider.component';

describe('ChecksliderComponent', () => {
  let component: ChecksliderComponent;
  let fixture: ComponentFixture<ChecksliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecksliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecksliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
