import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartsConfigComponent } from './carts-config.component';

describe('CartsConfigComponent', () => {
  let component: CartsConfigComponent;
  let fixture: ComponentFixture<CartsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
