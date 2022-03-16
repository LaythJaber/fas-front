import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationPurchaseComponent } from './configuration-purchase.component';

describe('CancelTimeComponent', () => {
  let component: ConfigurationPurchaseComponent;
  let fixture: ComponentFixture<ConfigurationPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
