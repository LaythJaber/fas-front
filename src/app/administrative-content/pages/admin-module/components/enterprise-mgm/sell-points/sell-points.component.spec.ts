import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellPointsComponent } from './sell-points.component';

describe('PointOfSalesComponent', () => {
  let component: SellPointsComponent;
  let fixture: ComponentFixture<SellPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
