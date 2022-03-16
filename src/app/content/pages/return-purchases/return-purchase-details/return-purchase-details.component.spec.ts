import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPurchaseDetailsComponent } from './return-purchase-details.component';

describe('ReturnPurchaseDetailsComponent', () => {
  let component: ReturnPurchaseDetailsComponent;
  let fixture: ComponentFixture<ReturnPurchaseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnPurchaseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPurchaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
