import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBreakdownComponent } from './inventory-breakdown.component';

describe('InventoryBreakdownComponent', () => {
  let component: InventoryBreakdownComponent;
  let fixture: ComponentFixture<InventoryBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
