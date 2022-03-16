import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProductModalComponent } from './cart-product-modal.component';

describe('CartProductModalComponent', () => {
  let component: CartProductModalComponent;
  let fixture: ComponentFixture<CartProductModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartProductModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
