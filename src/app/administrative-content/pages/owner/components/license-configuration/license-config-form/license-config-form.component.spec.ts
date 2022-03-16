import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseConfigFormComponent } from './license-config-form.component';

describe('LicenseConfigFormComponent', () => {
  let component: LicenseConfigFormComponent;
  let fixture: ComponentFixture<LicenseConfigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseConfigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
