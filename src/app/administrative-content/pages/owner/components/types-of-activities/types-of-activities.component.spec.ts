import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesOfActivitiesComponent } from './types-of-activities.component';

describe('TypeOfActivitiesComponent', () => {
  let component: TypesOfActivitiesComponent;
  let fixture: ComponentFixture<TypesOfActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypesOfActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesOfActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
