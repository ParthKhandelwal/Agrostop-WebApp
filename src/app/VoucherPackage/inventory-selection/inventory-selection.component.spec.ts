import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySelectionComponent } from './inventory-selection.component';

describe('InventorySelectionComponent', () => {
  let component: InventorySelectionComponent;
  let fixture: ComponentFixture<InventorySelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorySelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
