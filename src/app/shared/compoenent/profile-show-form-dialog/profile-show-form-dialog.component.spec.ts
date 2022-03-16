import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShowFormDialogComponent } from './profile-show-form-dialog.component';

describe('ProfileShowFormDialogComponent', () => {
  let component: ProfileShowFormDialogComponent;
  let fixture: ComponentFixture<ProfileShowFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileShowFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileShowFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
