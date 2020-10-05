import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropEntryComponent } from './crop-entry.component';

describe('CropEntryComponent', () => {
  let component: CropEntryComponent;
  let fixture: ComponentFixture<CropEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
