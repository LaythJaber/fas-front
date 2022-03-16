import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesEditorComponent } from './templates-editor.component';

describe('TemplatesEditorComponent', () => {
  let component: TemplatesEditorComponent;
  let fixture: ComponentFixture<TemplatesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
