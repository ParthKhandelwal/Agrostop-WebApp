import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalGroupEntryComponent } from './chemical-group-entry.component';

describe('ChemicalGroupEntryComponent', () => {
  let component: ChemicalGroupEntryComponent;
  let fixture: ComponentFixture<ChemicalGroupEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalGroupEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalGroupEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
