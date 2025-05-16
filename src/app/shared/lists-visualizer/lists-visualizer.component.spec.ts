import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsVisualizerComponent } from './lists-visualizer.component';

describe('ListsVisualizerComponent', () => {
  let component: ListsVisualizerComponent;
  let fixture: ComponentFixture<ListsVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsVisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
