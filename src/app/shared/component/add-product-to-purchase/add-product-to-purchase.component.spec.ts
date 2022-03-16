import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductToPurchaseComponent } from './add-product-to-purchase.component';

describe('AddProductToPurchaseComponent', () => {
  let component: AddProductToPurchaseComponent;
  let fixture: ComponentFixture<AddProductToPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductToPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductToPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
