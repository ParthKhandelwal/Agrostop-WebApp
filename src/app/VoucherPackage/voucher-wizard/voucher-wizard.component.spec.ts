import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherWizardComponent } from './voucher-wizard.component';

describe('VoucherWizardComponent', () => {
  let component: VoucherWizardComponent;
  let fixture: ComponentFixture<VoucherWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
