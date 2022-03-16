import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMgmComponent } from './role-mgm.component';

describe('RoleMgmComponent', () => {
  let component: RoleMgmComponent;
  let fixture: ComponentFixture<RoleMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
