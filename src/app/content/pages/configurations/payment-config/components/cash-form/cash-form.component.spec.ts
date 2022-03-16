import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFormComponent } from './cash-form.component';

describe('CashFormComponent', () => {
  let component: CashFormComponent;
  let fixture: ComponentFixture<CashFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
