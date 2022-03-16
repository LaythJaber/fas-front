import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCouponProductComponent } from './filter-coupon-product.component';

describe('FilterCouponProductComponent', () => {
  let component: FilterCouponProductComponent;
  let fixture: ComponentFixture<FilterCouponProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCouponProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCouponProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
