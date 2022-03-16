import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponManagementClientComponent } from './coupon-management-client.component';

describe('CouponManagementClientComponent', () => {
  let component: CouponManagementClientComponent;
  let fixture: ComponentFixture<CouponManagementClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponManagementClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponManagementClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
