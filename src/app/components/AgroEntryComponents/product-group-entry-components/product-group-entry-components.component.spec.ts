import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupEntryComponentsComponent } from './product-group-entry-components.component';

describe('ProductGroupEntryComponentsComponent', () => {
  let component: ProductGroupEntryComponentsComponent;
  let fixture: ComponentFixture<ProductGroupEntryComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGroupEntryComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupEntryComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
