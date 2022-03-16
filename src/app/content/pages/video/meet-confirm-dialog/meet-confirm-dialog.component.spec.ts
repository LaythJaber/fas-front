import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetConfirmDialogComponent } from './meet-confirm-dialog.component';

describe('MeetConfirmDialogComponent', () => {
  let component: MeetConfirmDialogComponent;
  let fixture: ComponentFixture<MeetConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
