import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleAppComponent } from './sale-app.component';

describe('SaleAppComponent', () => {
  let component: SaleAppComponent;
  let fixture: ComponentFixture<SaleAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
