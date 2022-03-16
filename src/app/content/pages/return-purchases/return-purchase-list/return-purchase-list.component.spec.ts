import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPurchaseListComponent } from './return-purchase-list.component';

describe('ReturnPurchaseComponent', () => {
  let component: ReturnPurchaseListComponent;
  let fixture: ComponentFixture<ReturnPurchaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnPurchaseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
