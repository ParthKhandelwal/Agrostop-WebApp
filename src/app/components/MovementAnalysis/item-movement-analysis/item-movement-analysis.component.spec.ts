import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMovementAnalysisComponent } from './item-movement-analysis.component';

describe('ItemMovementAnalysisComponent', () => {
  let component: ItemMovementAnalysisComponent;
  let fixture: ComponentFixture<ItemMovementAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMovementAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMovementAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
