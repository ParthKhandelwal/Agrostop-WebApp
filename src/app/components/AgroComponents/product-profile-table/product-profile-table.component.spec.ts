import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductProfileTableComponent } from './product-profile-table.component';

describe('ProductProfileTableComponent', () => {
  let component: ProductProfileTableComponent;
  let fixture: ComponentFixture<ProductProfileTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductProfileTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductProfileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
