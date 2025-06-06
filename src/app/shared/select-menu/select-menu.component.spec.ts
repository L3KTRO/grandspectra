import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMenuComponent } from './select-menu.component';

describe('SelectMenuComponent', () => {
  let component: SelectMenuComponent;
  let fixture: ComponentFixture<SelectMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
