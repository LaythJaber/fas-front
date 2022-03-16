import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterpriseMgmFormComponent } from './enterprise-mgm-form.component';


describe('EnterpriseMgmFormComponent', () => {
  let component: EnterpriseMgmFormComponent;
  let fixture: ComponentFixture<EnterpriseMgmFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseMgmFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseMgmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
