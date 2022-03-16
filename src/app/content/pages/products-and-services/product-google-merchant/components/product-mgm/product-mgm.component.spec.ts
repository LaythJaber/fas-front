import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMgmComponent } from './product-mgm.component';

describe('ProductMgmComponent', () => {
  let component: ProductMgmComponent;
  let fixture: ComponentFixture<ProductMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
