import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPriceListFormComponent } from './product-price-list-form.component';

describe('ProductPriceListFormComponent', () => {
  let component: ProductPriceListFormComponent;
  let fixture: ComponentFixture<ProductPriceListFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPriceListFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPriceListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
