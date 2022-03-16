import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateMgmFormModalComponent } from './date-mgm-form-modal.component';

describe('DateMgmFormModalComponent', () => {
  let component: DateMgmFormModalComponent;
  let fixture: ComponentFixture<DateMgmFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateMgmFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateMgmFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
