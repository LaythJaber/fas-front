import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySortComponent } from './category-sort.component';

describe('CategorySortComponent', () => {
  let component: CategorySortComponent;
  let fixture: ComponentFixture<CategorySortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
