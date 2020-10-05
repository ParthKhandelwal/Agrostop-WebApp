import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerMovementAnalysisComponent } from './ledger-movement-analysis.component';

describe('LedgerMovementAnalysisComponent', () => {
  let component: LedgerMovementAnalysisComponent;
  let fixture: ComponentFixture<LedgerMovementAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerMovementAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerMovementAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
