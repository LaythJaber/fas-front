import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMgmCartComponent } from './client-mgm-cart.component';

describe('ClientMgmCartComponent', () => {
  let component: ClientMgmCartComponent;
  let fixture: ComponentFixture<ClientMgmCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMgmCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMgmCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
