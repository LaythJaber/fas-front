import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsConfigFormComponent } from './sms-config-form.component';

describe('SmsConfigFormComponent', () => {
  let component: SmsConfigFormComponent;
  let fixture: ComponentFixture<SmsConfigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsConfigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
