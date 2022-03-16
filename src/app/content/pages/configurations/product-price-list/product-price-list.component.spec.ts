import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPriceListComponent } from './product-price-list.component';

describe('ProductPriceListComponent', () => {
  let component: ProductPriceListComponent;
  let fixture: ComponentFixture<ProductPriceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPriceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
