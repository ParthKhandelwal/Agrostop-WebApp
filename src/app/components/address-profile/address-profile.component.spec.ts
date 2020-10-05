import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressProfileComponent } from './address-profile.component';

describe('AddressProfileComponent', () => {
  let component: AddressProfileComponent;
  let fixture: ComponentFixture<AddressProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
