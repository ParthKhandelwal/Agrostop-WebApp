import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminToolkitComponent } from './admin-toolkit.component';

describe('AdminToolkitComponent', () => {
  let component: AdminToolkitComponent;
  let fixture: ComponentFixture<AdminToolkitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminToolkitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminToolkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
