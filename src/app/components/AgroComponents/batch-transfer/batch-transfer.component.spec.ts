import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTransferComponent } from './batch-transfer.component';

describe('BatchTransferComponent', () => {
  let component: BatchTransferComponent;
  let fixture: ComponentFixture<BatchTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
