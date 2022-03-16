import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorMgmFormDialogComponent } from './operator-mgm-form-dialog.component';

describe('UserMgmFormDialogComponent', () => {
  let component: OperatorMgmFormDialogComponent;
  let fixture: ComponentFixture<OperatorMgmFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorMgmFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorMgmFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
