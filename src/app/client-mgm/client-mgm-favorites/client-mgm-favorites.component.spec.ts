import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMgmFavoritesComponent } from './client-mgm-favorites.component';

describe('ClientMgmFavoritesComponent', () => {
  let component: ClientMgmFavoritesComponent;
  let fixture: ComponentFixture<ClientMgmFavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMgmFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMgmFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
