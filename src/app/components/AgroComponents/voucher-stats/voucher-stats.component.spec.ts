import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherStatsComponent } from './voucher-stats.component';

describe('VoucherStatsComponent', () => {
  let component: VoucherStatsComponent;
  let fixture: ComponentFixture<VoucherStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
