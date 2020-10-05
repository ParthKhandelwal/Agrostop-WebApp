import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropProfileComponent } from './crop-profile.component';

describe('CropProfileComponent', () => {
  let component: CropProfileComponent;
  let fixture: ComponentFixture<CropProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
