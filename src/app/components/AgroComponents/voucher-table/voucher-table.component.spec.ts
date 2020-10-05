import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherTableComponent } from './voucher-table.component';

describe('VoucherTableComponent', () => {
  let component: VoucherTableComponent;
  let fixture: ComponentFixture<VoucherTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
