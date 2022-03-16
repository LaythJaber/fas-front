import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FasUserDetailComponent } from './fas-user-detail.component';

describe('FasUserDetailComponent', () => {
  let component: FasUserDetailComponent;
  let fixture: ComponentFixture<FasUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FasUserDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
