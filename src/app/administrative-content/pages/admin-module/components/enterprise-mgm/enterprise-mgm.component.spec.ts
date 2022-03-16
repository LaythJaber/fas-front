import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterpriseMgmComponent } from './enterprise-mgm.component';


describe('EnterpriseMgmComponent', () => {
  let component: EnterpriseMgmComponent;
  let fixture: ComponentFixture<EnterpriseMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
