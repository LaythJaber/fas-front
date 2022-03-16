import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartManagementModalComponent } from './cart-management-modal.component';

describe('CartManagementModalComponent', () => {
  let component: CartManagementModalComponent;
  let fixture: ComponentFixture<CartManagementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartManagementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
