import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMgmAddressesComponent } from './client-mgm-addresses.component';

describe('ClientMgmAddressesComponent', () => {
  let component: ClientMgmAddressesComponent;
  let fixture: ComponentFixture<ClientMgmAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMgmAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMgmAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
