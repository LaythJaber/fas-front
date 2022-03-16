import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FasAdminComponent } from './fas-admin.component';

describe('FasAdminComponent', () => {
  let component: FasAdminComponent;
  let fixture: ComponentFixture<FasAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FasAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
