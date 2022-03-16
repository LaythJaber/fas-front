import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodiceIVAComponent } from './codice-iva.component';

describe('CodiceIVAComponent', () => {
  let component: CodiceIVAComponent;
  let fixture: ComponentFixture<CodiceIVAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodiceIVAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodiceIVAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
