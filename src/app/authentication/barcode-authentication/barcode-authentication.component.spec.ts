import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeAuthenticationComponent } from './barcode-authentication.component';

describe('BarcodeAuthenticationComponent', () => {
  let component: BarcodeAuthenticationComponent;
  let fixture: ComponentFixture<BarcodeAuthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeAuthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
