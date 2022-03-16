import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsTabComponent } from './applications-tab.component';

describe('ApplicationsTabComponent', () => {
  let component: ApplicationsTabComponent;
  let fixture: ComponentFixture<ApplicationsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
