import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMgmComponent } from './group-mgm.component';

describe('GroupMgmComponent', () => {
  let component: GroupMgmComponent;
  let fixture: ComponentFixture<GroupMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
