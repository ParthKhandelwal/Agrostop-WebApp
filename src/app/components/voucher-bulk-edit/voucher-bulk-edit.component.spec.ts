import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherBulkEditComponent } from './voucher-bulk-edit.component';

describe('VoucherBulkEditComponent', () => {
  let component: VoucherBulkEditComponent;
  let fixture: ComponentFixture<VoucherBulkEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherBulkEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherBulkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
