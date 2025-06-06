import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreatorComponent } from './list-creator.component';

describe('ContentListCreatorComponent', () => {
  let component: ListCreatorComponent;
  let fixture: ComponentFixture<ListCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
