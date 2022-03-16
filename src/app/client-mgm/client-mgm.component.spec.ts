import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMgmComponent } from './client-mgm.component';

describe('ClientMgmComponent', () => {
  let component: ClientMgmComponent;
  let fixture: ComponentFixture<ClientMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
