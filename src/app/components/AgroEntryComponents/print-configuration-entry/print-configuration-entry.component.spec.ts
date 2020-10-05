import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConfigurationEntryComponent } from './print-configuration-entry.component';

describe('PrintConfigurationEntryComponent', () => {
  let component: PrintConfigurationEntryComponent;
  let fixture: ComponentFixture<PrintConfigurationEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintConfigurationEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintConfigurationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
