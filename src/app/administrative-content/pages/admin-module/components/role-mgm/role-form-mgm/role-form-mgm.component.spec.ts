import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFormMgmComponent } from './role-form-mgm.component';

describe('RoleFormMgmComponent', () => {
  let component: RoleFormMgmComponent;
  let fixture: ComponentFixture<RoleFormMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleFormMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFormMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
