import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferTableComponent } from './stock-transfer-table.component';

describe('StockTransferTableComponent', () => {
  let component: StockTransferTableComponent;
  let fixture: ComponentFixture<StockTransferTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransferTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransferTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
