import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVoucherWizardComponent } from './payment-voucher-wizard.component';

describe('PaymentVoucherWizardComponent', () => {
  let component: PaymentVoucherWizardComponent;
  let fixture: ComponentFixture<PaymentVoucherWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentVoucherWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVoucherWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
