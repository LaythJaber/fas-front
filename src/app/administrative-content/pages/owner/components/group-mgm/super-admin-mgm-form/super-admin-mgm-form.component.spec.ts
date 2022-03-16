import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminMgmFormComponent } from './super-admin-mgm-form.component';

describe('SuperAdminMgmForComponent', () => {
  let component: SuperAdminMgmFormComponent;
  let fixture: ComponentFixture<SuperAdminMgmFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminMgmFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminMgmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
