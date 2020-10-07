import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryEntryINComponent } from './inventory-entry-in.component';

describe('InventoryEntryINComponent', () => {
  let component: InventoryEntryINComponent;
  let fixture: ComponentFixture<InventoryEntryINComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryEntryINComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryEntryINComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
