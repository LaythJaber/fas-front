import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponManagementProductComponent } from './coupon-management-product.component';

describe('CouponManagementProductComponent', () => {
  let component: CouponManagementProductComponent;
  let fixture: ComponentFixture<CouponManagementProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponManagementProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponManagementProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
