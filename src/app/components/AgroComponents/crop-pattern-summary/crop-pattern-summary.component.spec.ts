import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropPatternSummaryComponent } from './crop-pattern-summary.component';

describe('CropPatternSummaryComponent', () => {
  let component: CropPatternSummaryComponent;
  let fixture: ComponentFixture<CropPatternSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropPatternSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropPatternSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
