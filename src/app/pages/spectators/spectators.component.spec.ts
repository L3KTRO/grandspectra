import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectatorsComponent } from './spectators.component';

describe('SpectatorsComponent', () => {
  let component: SpectatorsComponent;
  let fixture: ComponentFixture<SpectatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpectatorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpectatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
