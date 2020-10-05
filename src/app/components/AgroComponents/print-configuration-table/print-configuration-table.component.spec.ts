import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConfigurationTableComponent } from './print-configuration-table.component';

describe('PrintConfigurationTableComponent', () => {
  let component: PrintConfigurationTableComponent;
  let fixture: ComponentFixture<PrintConfigurationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintConfigurationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintConfigurationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
