import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCouponCategoryComponent } from './filter-coupon-category.component';

describe('FilterCouponCategoryComponent', () => {
  let component: FilterCouponCategoryComponent;
  let fixture: ComponentFixture<FilterCouponCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCouponCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCouponCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
