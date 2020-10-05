import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroVoucherWizardComponent } from './agro-voucher-wizard.component';

describe('AgroVoucherWizardComponent', () => {
  let component: AgroVoucherWizardComponent;
  let fixture: ComponentFixture<AgroVoucherWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgroVoucherWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroVoucherWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
