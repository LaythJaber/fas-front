import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsTabComponent } from './ds-tab.component';

describe('DsTabComponent', () => {
  let component: DsTabComponent;
  let fixture: ComponentFixture<DsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
