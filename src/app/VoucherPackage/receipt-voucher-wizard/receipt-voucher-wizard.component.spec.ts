import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptVoucherWizardComponent } from './receipt-voucher-wizard.component';

describe('ReceiptVoucherWizardComponent', () => {
  let component: ReceiptVoucherWizardComponent;
  let fixture: ComponentFixture<ReceiptVoucherWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptVoucherWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptVoucherWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
