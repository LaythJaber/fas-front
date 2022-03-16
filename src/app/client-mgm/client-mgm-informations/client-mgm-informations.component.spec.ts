import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMgmInformationsComponent } from './client-mgm-informations.component';

describe('ClientMgmInformationsComponent', () => {
  let component: ClientMgmInformationsComponent;
  let fixture: ComponentFixture<ClientMgmInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMgmInformationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMgmInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
