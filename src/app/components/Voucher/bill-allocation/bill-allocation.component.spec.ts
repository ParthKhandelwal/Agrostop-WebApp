import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAllocationComponent } from './bill-allocation.component';

describe('BillAllocationComponent', () => {
  let component: BillAllocationComponent;
  let fixture: ComponentFixture<BillAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
