import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellPointFormComponent } from './sell-point-form.component';

describe('SellPointFormComponent', () => {
  let component: SellPointFormComponent;
  let fixture: ComponentFixture<SellPointFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellPointFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellPointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
