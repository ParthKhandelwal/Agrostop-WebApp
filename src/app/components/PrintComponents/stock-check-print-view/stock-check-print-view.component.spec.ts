import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCheckPrintViewComponent } from './stock-check-print-view.component';

describe('StockCheckPrintViewComponent', () => {
  let component: StockCheckPrintViewComponent;
  let fixture: ComponentFixture<StockCheckPrintViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockCheckPrintViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCheckPrintViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
