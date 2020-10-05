import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularTableComponent } from './particular-table.component';

describe('ParticularTableComponent', () => {
  let component: ParticularTableComponent;
  let fixture: ComponentFixture<ParticularTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticularTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticularTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
