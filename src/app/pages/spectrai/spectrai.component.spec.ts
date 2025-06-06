import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectraiComponent } from './spectrai.component';

describe('SpectraiComponent', () => {
  let component: SpectraiComponent;
  let fixture: ComponentFixture<SpectraiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpectraiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpectraiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
