import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OperatorMgmService} from '../../services/operator-mgm.service';
import {AuthService} from '../../services/auth-jwt.service';

@Component({
  selector: 'app-profile-show-form-dialog',
  templateUrl: './profile-show-form-dialog.component.html',
  styleUrls: ['./profile-show-form-dialog.component.scss']
})
export class ProfileShowFormDialogComponent implements OnInit {
  profileForm: FormGroup;
  password: boolean;
  oldPwdType = 'password';
  newPwdType = 'password';
  showOldPass = false;
  showNewPass = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private operatorService: OperatorMgmService,
    public dialogRef: MatDialogRef<ProfileShowFormDialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.initForms();
    this.profileForm.patchValue(this.data);
  }

  initForms() {
    this.profileForm = new FormBuilder().group({
      username: new FormControl(null),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      profile: new FormControl(null),
      email: new FormControl(null),
      oldPassword: new FormControl(null),
      passwordPlainText: new FormControl(null),
      confirmPassword: new FormControl(null)
    }, {validator: this.matchPasswords('passwordPlainText', 'confirmPassword')});
    this.profileForm.get('username').disable();
    this.profileForm.get('firstName').disable();
    this.profileForm.get('lastName').disable();
    this.profileForm.get('profile').disable();
    this.profileForm.get('email').disable();
  }

  save() {
    if (this.profileForm.valid) {
      const request = {
        password: this.profileForm.get('oldPassword').value,
        newPassword: this.profileForm.get('passwordPlainText').value
      };
      this.authService.changePassword(request).subscribe(r => {
        if (r) {
          this.dialogRef.close(true);
        }
      });
    }
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
    this.password = !this.password;
    if (this.password) {
      this.profileForm.get('oldPassword').setValidators(Validators.required);
      this.profileForm.get('passwordPlainText').setValidators([Validators.required, Validators.minLength(6)]);
      this.profileForm.get('confirmPassword').setValidators(Validators.required);
    } else {
      this.profileForm.get('oldPassword').setValue(null);
      this.profileForm.get('passwordPlainText').setValue(null);
      this.profileForm.get('confirmPassword').setValue(null);
      this.profileForm.get('oldPassword').clearValidators();
      this.profileForm.get('passwordPlainText').setValidators(Validators.required);
      this.profileForm.get('confirmPassword').setValidators(Validators.required);
    }
    this.profileForm.get('oldPassword').updateValueAndValidity();
    this.profileForm.get('passwordPlainText').updateValueAndValidity();
    this.profileForm.get('confirmPassword').updateValueAndValidity();

  }

  showOldPassword() {
    this.showOldPass = !this.showOldPass;
    if (this.showOldPass) {
      this.oldPwdType = 'text';
    } else {
      this.oldPwdType = 'password';
    }
  }

  showNewPassword() {
    this.showNewPass = !this.showNewPass;
    if (this.showNewPass) {
      this.newPwdType = 'text';
    } else {
      this.newPwdType = 'password';
    }
  }


  get f() {
    return this.profileForm.controls;
  }

}
