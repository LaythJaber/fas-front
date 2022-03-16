import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth-jwt.service';
import {UserService} from '../shared/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ChooseSellPointResponse, SellPointService} from '../shared/services/sell-point.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslationLoaderService} from '../core/services/translation-loader.service';
import {AuthResponse} from '../shared/models/auth-response';
import {DateAdapter} from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {BarcodeAuthenticationComponent} from './barcode-authentication/barcode-authentication.component';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as Swal from 'sweetalert2';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  response: ChooseSellPointResponse;
  @ViewChild('carousel') carousel: ElementRef;
  sellPointFormControl = new FormControl(null, Validators.required);
  private pendingToken: string;
  showChooseSellPoint = false;
  private unsubscribe$ = new Subject();
  fieldTextType: boolean;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sellPointService: SellPointService,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService,
    public translationLoaderService: TranslationLoaderService,
    private dateAdapter: DateAdapter<any>,
    private matDialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      rememberMe: false
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  get username() {
    return this.loginForm.get('username') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe') as FormControl;
  }

  login() {
    let username;
    let password;
    const loginRequest = {username, password} = this.loginForm.value;
    this.authService.login(loginRequest).subscribe((resp: AuthResponse) => {
      if (resp && resp.status.startsWith('PENDING')) { // Pending token
        this.pendingToken = resp.token;
        const header = new HttpHeaders().set('Authorization', `Bearer ${this.pendingToken}`);
      }
      this.userService.identity().subscribe((u) => {

        if (u.status === 'PENDING' ) {
          this.matSnackBar.open(this.translateService.instant('User not confirmed yet'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar'
          });
          this.clear();
          return;
        }

        if (u.status === 'BLOCKED' ) {
          this.matSnackBar.open(this.translateService.instant('User blocked'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar'
          });
          this.clear();
          return;
        }
        this.userService.saveUser(u, this.rememberMe.value);

        if (u.authorities.some(e => e === 'OWNER')) {
          this.router.navigate(['/admin/owner']);
          return;
        }
        if (u.authorities.some(e => e === 'STUDENT')) {
          this.router.navigate(['']);
          return;
        }

        if (u.authorities.some(e => e === 'ADMIN')) {
          this.router.navigate(['/fas-admin']);
          return;
        }
        this.router.navigate(['/']);
      });
    }, (error: HttpErrorResponse) => {
      if (error.error.message.includes('INVALID_CREDENTIALS')) {
        this.matSnackBar.open(this.translateService.instant('LOGIN.WRONG_USERNAME_PASSWORD'), 'Ok', {
          duration: 5000,
          panelClass: 'white-snackbar'
        });
      } else if (error.error.message.includes('ACCOUNT_LOCKED')) {
        this.matSnackBar.open(this.translateService.instant('LOGIN.ACCOUNT_LOCKED'), 'Ok', {
          duration: 5000,
          panelClass: 'white-snackbar'
        });
      }

    });
  }

  chooseSellPoint() {
    const header = new HttpHeaders().set('Authorization', `Bearer ${this.pendingToken}`);
    this.authService.chooseSellPoint(this.sellPointFormControl.value, this.rememberMe.value, header).subscribe(data => {
      this.userService.identity().subscribe(u => {
        this.userService.saveUser(u, this.rememberMe.value);
        this.router.navigate(['/']);
      });
    });
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

  openBarcodeAuthentication() {
    this.matDialog.open(BarcodeAuthenticationComponent, {
      width: '600px'
    }).afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(code => {
      this.authService.loginWithBarcode(code, this.rememberMe.value).subscribe((resp: AuthResponse) => {
        if (resp && resp.status) { // Pending token
          this.pendingToken = resp.token;
          const header = new HttpHeaders().set('Authorization', `Bearer ${this.pendingToken}`);
          if (resp.status === 'PENDING_SUPER_ADMIN') {
            this.sellPointService.getSellPointsFromGroup(header).subscribe(data => {
              this.response = data;
              this.showChooseSellPoint = true;
            });
            return;
          }
          this.sellPointService.getSellPointsFromAccount(header).subscribe(data => {
            this.response = data;
            this.showChooseSellPoint = true;
          });
          return;
        }
        this.userService.identity().subscribe((u) => {
          this.userService.saveUser(u, this.rememberMe.value);
          this.router.navigate(['/']);
        });
      }, (error: HttpErrorResponse) => {
        console.log(error);
        if (error.error.message.includes('INVALID_CREDENTIALS')) {
          this.matSnackBar.open(this.translateService.instant('LOGIN.WRONG_USERNAME_PASSWORD'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar'
          });
          return;
        }
        if (error.error.message.includes('ACCOUNT_LOCKED')) {
          this.matSnackBar.open(this.translateService.instant('LOGIN.ACCOUNT_LOCKED'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar'
          });
          return;
        }
        if (error.error.message.includes('OWNER_OR_SUPEADMIN_BARCODE_ERROR')) {
          this.matSnackBar.open(this.translateService.instant('LOGIN.OWNER_OR_SUPEADMIN_BARCODE_ERROR'), 'Ok', {
            duration: 15000,
            panelClass: 'white-snackbar'
          });
          return;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
