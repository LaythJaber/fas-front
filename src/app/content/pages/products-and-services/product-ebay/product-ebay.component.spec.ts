import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEbayComponent } from './product-ebay.component';

describe('ProductEbayComponent', () => {
  let component: ProductEbayComponent;
  let fixture: ComponentFixture<ProductEbayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEbayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEbayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
