import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorMgmComponent } from './color-mgm.component';

describe('ColorMgmComponent', () => {
  let component: ColorMgmComponent;
  let fixture: ComponentFixture<ColorMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
