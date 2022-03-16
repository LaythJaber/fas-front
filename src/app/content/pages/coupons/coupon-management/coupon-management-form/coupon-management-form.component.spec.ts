import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponManagementFormComponent } from './coupon-management-form.component';

describe('CouponManagementFormComponent', () => {
  let component: CouponManagementFormComponent;
  let fixture: ComponentFixture<CouponManagementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponManagementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
