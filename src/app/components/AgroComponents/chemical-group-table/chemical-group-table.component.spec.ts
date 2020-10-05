import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalGroupTableComponent } from './chemical-group-table.component';

describe('ChemicalGroupTableComponent', () => {
  let component: ChemicalGroupTableComponent;
  let fixture: ComponentFixture<ChemicalGroupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalGroupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
