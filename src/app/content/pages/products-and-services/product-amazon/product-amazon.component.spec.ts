import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAmazonComponent } from './product-amazon.component';

describe('ProductAmazonComponent', () => {
  let component: ProductAmazonComponent;
  let fixture: ComponentFixture<ProductAmazonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAmazonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAmazonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
