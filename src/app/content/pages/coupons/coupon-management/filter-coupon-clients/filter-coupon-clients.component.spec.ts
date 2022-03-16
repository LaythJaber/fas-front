import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCouponClientsComponent } from './filter-coupon-clients.component';

describe('FilterCouponClientsComponent', () => {
  let component: FilterCouponClientsComponent;
  let fixture: ComponentFixture<FilterCouponClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCouponClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCouponClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
