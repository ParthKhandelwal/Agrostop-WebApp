import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStatComponent } from './product-stat.component';

describe('ProductStatComponent', () => {
  let component: ProductStatComponent;
  let fixture: ComponentFixture<ProductStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
