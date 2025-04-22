import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaContentDisplayComponent } from './media-content-display.component';

describe('MediaContentDisplayComponent', () => {
  let component: MediaContentDisplayComponent;
  let fixture: ComponentFixture<MediaContentDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaContentDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaContentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
