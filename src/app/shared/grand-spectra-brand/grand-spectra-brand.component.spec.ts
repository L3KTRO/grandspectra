import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandSpectraBrandComponent } from './grand-spectra-brand.component';

describe('GrandSpectraBrandComponent', () => {
  let component: GrandSpectraBrandComponent;
  let fixture: ComponentFixture<GrandSpectraBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrandSpectraBrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrandSpectraBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
