import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";
import {AuthResponse} from "../../shared/models/auth-response";
import * as Swal from 'sweetalert2';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {BarcodeAuthenticationComponent} from "../barcode-authentication/barcode-authentication.component";
import {AuthService} from "../../shared/services/auth-jwt.service";
import {ChooseSellPointResponse, SellPointService} from "../../shared/services/sell-point.service";
import {UserService} from "../../shared/services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {TranslationLoaderService} from "../../core/services/translation-loader.service";
import {MatDialog} from "@angular/material/dialog";
import {DateAdapter} from '@angular/material';
import {StudentService} from "../../shared/services/student.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  clases: any[];
  departements: any[];
  selectedDevice = null;

  countries: string[];
  // Private
  private _unsubscribeAll: Subject<any>;

  response: ChooseSellPointResponse;
  @ViewChild('carousel') carousel: ElementRef;
  sellPointFormControl = new FormControl(null, Validators.required);
  private pendingToken: string;
  showChooseSellPoint = false;
  private unsubscribe$ = new Subject();
  fieldTextType: boolean;
  fieldTextType2: boolean;

  constructor(
    private _formBuilder: FormBuilder,
  //  private etudiantService: EtudiantService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sellPointService: SellPointService,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    public translationLoaderService: TranslationLoaderService,
    private matDialog: MatDialog,
    private dateAdapter: DateAdapter<any>,
    private studentService: StudentService,
    private http: HttpClient,
  )
  {

    // Set the private defaults
    this._unsubscribeAll = new Subject();

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
    this.registerForm = this._formBuilder.group({
      id: null,
      firstName           : ['', Validators.required],
      lastName           : ['', Validators.required],
      mobile           : ['', Validators.required],
      email           : ['', [Validators.required, Validators.email]],
      username          : ['', [Validators.required]],
      password       : ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
      address: ['', Validators.required],
      country: ['', Validators.required]
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.registerForm.get('password').valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.registerForm.get('passwordConfirm').updateValueAndValidity();
      });

    this.http.get<{ country: string, prefix: string}[]>('/assets/TEL_PREFIX.json').subscribe((d:{ country: string, prefix: string}[]) => {
        this.countries = d.map( e => e.country);
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  submitForm(): void {

    this.authService.save(this.registerForm.value).subscribe(
      data => {
        this.router.navigateByUrl('/login');
        console.log('welcome to the academy');
      }
    );
  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }



  clear() {
    this.authService.logout().subscribe();
    this.response = null;
    this.showChooseSellPoint = false;
  }

  changeLang(lang: 'en' | 'ar' | 'fr') {
    this.translationLoaderService.setLanguage(lang);
    this.dateAdapter.setLocale(lang);
  }

}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if ( !control.parent || !control )
  {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if ( !password || !passwordConfirm )
  {
    return null;
  }

  if ( passwordConfirm.value === '' )
  {
    return null;
  }

  if ( password.value === passwordConfirm.value )
  {
    return null;
  }

  return {passwordsNotMatching: true};
};
