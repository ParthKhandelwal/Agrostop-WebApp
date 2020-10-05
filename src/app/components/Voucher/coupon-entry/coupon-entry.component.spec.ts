import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponEntryComponent } from './coupon-entry.component';

describe('CouponEntryComponent', () => {
  let component: CouponEntryComponent;
  let fixture: ComponentFixture<CouponEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
