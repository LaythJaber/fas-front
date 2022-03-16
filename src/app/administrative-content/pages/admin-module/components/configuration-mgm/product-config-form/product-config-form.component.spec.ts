import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductConfigFormComponent } from './product-config-form.component';

describe('ProductConfigFormComponent', () => {
  let component: ProductConfigFormComponent;
  let fixture: ComponentFixture<ProductConfigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductConfigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
