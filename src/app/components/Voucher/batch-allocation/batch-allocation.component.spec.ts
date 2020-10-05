import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchAllocationComponent } from './batch-allocation.component';

describe('BatchAllocationComponent', () => {
  let component: BatchAllocationComponent;
  let fixture: ComponentFixture<BatchAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
