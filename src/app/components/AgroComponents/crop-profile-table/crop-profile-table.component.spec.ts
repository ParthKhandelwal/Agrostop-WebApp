import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropProfileTableComponent } from './crop-profile-table.component';

describe('CropProfileTableComponent', () => {
  let component: CropProfileTableComponent;
  let fixture: ComponentFixture<CropProfileTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropProfileTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropProfileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
