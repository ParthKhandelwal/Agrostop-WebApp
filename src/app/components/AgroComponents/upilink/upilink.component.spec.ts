import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UPILinkComponent } from './upilink.component';

describe('UPILinkComponent', () => {
  let component: UPILinkComponent;
  let fixture: ComponentFixture<UPILinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UPILinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UPILinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
