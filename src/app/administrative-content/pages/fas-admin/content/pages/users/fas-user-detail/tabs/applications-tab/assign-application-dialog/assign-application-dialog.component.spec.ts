import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignApplicationDialogComponent } from './assign-application-dialog.component';

describe('AssignApplicationDialogComponent', () => {
  let component: AssignApplicationDialogComponent;
  let fixture: ComponentFixture<AssignApplicationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignApplicationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
