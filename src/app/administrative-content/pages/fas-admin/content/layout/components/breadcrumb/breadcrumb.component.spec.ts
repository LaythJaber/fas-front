import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FasBreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: FasBreadcrumbComponent;
  let fixture: ComponentFixture<FasBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FasBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
