import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMgmModalComponent } from './client-mgm-modal.component';

describe('ClientMgmModalComponent', () => {
  let component: ClientMgmModalComponent;
  let fixture: ComponentFixture<ClientMgmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMgmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMgmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
