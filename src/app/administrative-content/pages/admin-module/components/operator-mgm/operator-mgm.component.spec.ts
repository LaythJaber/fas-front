import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorMgmComponent } from './operator-mgm.component';

describe('UserMgmDialogComponent', () => {
  let component: OperatorMgmComponent;
  let fixture: ComponentFixture<OperatorMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
