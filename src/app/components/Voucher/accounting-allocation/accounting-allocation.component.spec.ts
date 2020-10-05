import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingAllocationComponent } from './accounting-allocation.component';

describe('AccountingAllocationComponent', () => {
  let component: AccountingAllocationComponent;
  let fixture: ComponentFixture<AccountingAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
