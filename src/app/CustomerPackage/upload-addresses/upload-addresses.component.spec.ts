import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAddressesComponent } from './upload-addresses.component';

describe('UploadAddressesComponent', () => {
  let component: UploadAddressesComponent;
  let fixture: ComponentFixture<UploadAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
