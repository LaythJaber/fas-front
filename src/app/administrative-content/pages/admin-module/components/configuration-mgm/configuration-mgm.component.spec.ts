import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationMgmComponent } from './configuration-mgm.component';

describe('ConfigurationMgmComponent', () => {
  let component: ConfigurationMgmComponent;
  let fixture: ComponentFixture<ConfigurationMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
