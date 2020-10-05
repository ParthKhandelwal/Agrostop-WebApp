import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductProfileEntryComponentComponent } from './product-profile-entry-component.component';

describe('ProductProfileEntryComponentComponent', () => {
  let component: ProductProfileEntryComponentComponent;
  let fixture: ComponentFixture<ProductProfileEntryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductProfileEntryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductProfileEntryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
