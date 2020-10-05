import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherFilterComponent } from './voucher-filter.component';

describe('VoucherFilterComponent', () => {
  let component: VoucherFilterComponent;
  let fixture: ComponentFixture<VoucherFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
