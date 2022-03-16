import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementManagementComponent } from './movement-management.component';

describe('MovementManagementComponent', () => {
  let component: MovementManagementComponent;
  let fixture: ComponentFixture<MovementManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
