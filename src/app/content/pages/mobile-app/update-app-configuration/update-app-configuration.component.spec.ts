import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppConfigurationComponent } from './update-app-configuration.component';

describe('UpdateAppConfigurationComponent', () => {
  let component: UpdateAppConfigurationComponent;
  let fixture: ComponentFixture<UpdateAppConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAppConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAppConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
