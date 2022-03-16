import {Component, OnDestroy, OnInit, SystemJsNgModuleLoader} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {RecoverPasswordService} from '../shared/services/recover-password.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslationLoaderService} from '../core/services/translation-loader.service';
import {DateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm: FormGroup;
  passwordValidators = {upper: false, lower: false, length: false, number: false};
  private unsub$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private recoverPasswordService: RecoverPasswordService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public translationLoaderService: TranslationLoaderService,
    private dateAdapter: DateAdapter<any>,) {
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
      ])],
      confirmPassword: [null, Validators.required],
    }, {validators: this.matchPasswords('password', 'confirmPassword')});
    this.setUpPasswordValidation();
  }

  private setUpPasswordValidation() {
    this.changePasswordForm.get('password').valueChanges.pipe(takeUntil(this.unsub$)).subscribe(v => {
      this.passwordValidators.length = v !== null && v.length >= 6;
      this.passwordValidators.lower = /^(?=.*[a-z])/.test(v);
      this.passwordValidators.upper = /^(?=.*[A-Z])/.test(v);
      this.passwordValidators.number = /^(?=.*[0-9])/.test(v);
    });
  }

  matchPasswords(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      console.log("error in form");
      return;
    }
    this.recoverPasswordService.changePassword({
      password: this.changePasswordForm.value.password,
      token: this.activatedRoute.snapshot.paramMap.get('token')
    }).subscribe(d => {
      if (d) {
        this.router.navigate(['']);
      }
    });

  }

  changeLang(lang: 'en' | 'it' | 'fr') {
    this.translationLoaderService.setLanguage(lang);
    this.dateAdapter.setLocale(lang);
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }
}