import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallyConsoleComponent } from './tally-console.component';

describe('TallyConsoleComponent', () => {
  let component: TallyConsoleComponent;
  let fixture: ComponentFixture<TallyConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallyConsoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallyConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
