import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferComparisonComponent } from './stock-transfer-comparison.component';

describe('StockTransferComparisonComponent', () => {
  let component: StockTransferComparisonComponent;
  let fixture: ComponentFixture<StockTransferComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransferComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
