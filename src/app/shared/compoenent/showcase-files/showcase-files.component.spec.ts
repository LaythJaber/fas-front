import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseFilesComponent } from './showcase-files.component';

describe('ShowcaseFilesComponent', () => {
  let component: ShowcaseFilesComponent;
  let fixture: ComponentFixture<ShowcaseFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
