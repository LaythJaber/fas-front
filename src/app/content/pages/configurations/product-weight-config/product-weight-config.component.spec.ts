import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWeightConfigComponent } from './product-weight-config.component';

describe('ProductWeightConfigComponent', () => {
  let component: ProductWeightConfigComponent;
  let fixture: ComponentFixture<ProductWeightConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWeightConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWeightConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
