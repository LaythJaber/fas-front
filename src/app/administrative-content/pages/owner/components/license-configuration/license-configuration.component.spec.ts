import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseConfigurationComponent } from './license-configuration.component';

describe('LicenseConfigurationComponent', () => {
  let component: LicenseConfigurationComponent;
  let fixture: ComponentFixture<LicenseConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
