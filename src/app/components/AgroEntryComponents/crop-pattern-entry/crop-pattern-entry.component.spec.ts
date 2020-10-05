import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropPatternEntryComponent } from './crop-pattern-entry.component';

describe('CropPatternEntryComponent', () => {
  let component: CropPatternEntryComponent;
  let fixture: ComponentFixture<CropPatternEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropPatternEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropPatternEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
