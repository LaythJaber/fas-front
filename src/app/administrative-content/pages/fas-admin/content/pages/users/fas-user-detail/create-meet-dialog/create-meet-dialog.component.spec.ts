import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMeetDialogComponent } from './create-meet-dialog.component';

describe('CreateMeetDialogComponent', () => {
  let component: CreateMeetDialogComponent;
  let fixture: ComponentFixture<CreateMeetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMeetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMeetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
