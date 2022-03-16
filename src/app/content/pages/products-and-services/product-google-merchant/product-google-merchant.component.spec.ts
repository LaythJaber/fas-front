import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGoogleMerchantComponent } from './product-google-merchant.component';

describe('ProductGoogleMerchantComponent', () => {
  let component: ProductGoogleMerchantComponent;
  let fixture: ComponentFixture<ProductGoogleMerchantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGoogleMerchantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGoogleMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
