import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSettingComponent } from './voucher-setting.component';

describe('VoucherSettingComponent', () => {
  let component: VoucherSettingComponent;
  let fixture: ComponentFixture<VoucherSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
