import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSummaryComponent } from './voucher-summary.component';

describe('VoucherSummaryComponent', () => {
  let component: VoucherSummaryComponent;
  let fixture: ComponentFixture<VoucherSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
