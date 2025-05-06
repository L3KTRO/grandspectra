import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsandreviewComponent } from './ratingsandreview.component';

describe('RatingsandreviewComponent', () => {
  let component: RatingsandreviewComponent;
  let fixture: ComponentFixture<RatingsandreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingsandreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingsandreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
