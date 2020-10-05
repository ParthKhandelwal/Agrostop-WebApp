import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAllocationComponent } from './bank-allocation.component';

describe('BankAllocationComponent', () => {
  let component: BankAllocationComponent;
  let fixture: ComponentFixture<BankAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
