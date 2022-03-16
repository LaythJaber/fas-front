import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeMgmComponent } from './size-mgm.component';

describe('SizeMgmComponent', () => {
  let component: SizeMgmComponent;
  let fixture: ComponentFixture<SizeMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
