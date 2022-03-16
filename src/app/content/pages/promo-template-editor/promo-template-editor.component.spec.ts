import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoTemplateEditorComponent } from './promo-template-editor.component';

describe('PromoTemplateEditorComponent', () => {
  let component: PromoTemplateEditorComponent;
  let fixture: ComponentFixture<PromoTemplateEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoTemplateEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoTemplateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
