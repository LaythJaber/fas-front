import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementManagementFormComponent } from './movement-management-form.component';

describe('MovementManagementFormComponent', () => {
  let component: MovementManagementFormComponent;
  let fixture: ComponentFixture<MovementManagementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementManagementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
