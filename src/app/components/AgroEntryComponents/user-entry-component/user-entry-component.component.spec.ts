import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEntryComponentComponent } from './user-entry-component.component';

describe('UserEntryComponentComponent', () => {
  let component: UserEntryComponentComponent;
  let fixture: ComponentFixture<UserEntryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEntryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEntryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
