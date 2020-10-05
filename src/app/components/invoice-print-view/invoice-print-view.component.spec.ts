import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePrintViewComponent } from './invoice-print-view.component';

describe('InvoicePrintViewComponent', () => {
  let component: InvoicePrintViewComponent;
  let fixture: ComponentFixture<InvoicePrintViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePrintViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePrintViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
