import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTranslationComponent } from './generic-translation.component';

describe('GenericTranslationComponent', () => {
  let component: GenericTranslationComponent;
  let fixture: ComponentFixture<GenericTranslationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericTranslationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
