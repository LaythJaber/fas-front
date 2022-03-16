import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeGuideComponent } from './size-guide.component';

describe('SizeGuideComponent', () => {
  let component: SizeGuideComponent;
  let fixture: ComponentFixture<SizeGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
