import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessOrderFormComponent } from './process-order-form.component';

describe('ProcessOrderFormComponent', () => {
  let component: ProcessOrderFormComponent;
  let fixture: ComponentFixture<ProcessOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessOrderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
