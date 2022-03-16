import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPurchaseConfigComponent } from './return-purchase-config.component';

describe('ReturnProductComponent', () => {
  let component: ReturnPurchaseConfigComponent;
  let fixture: ComponentFixture<ReturnPurchaseConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnPurchaseConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPurchaseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
