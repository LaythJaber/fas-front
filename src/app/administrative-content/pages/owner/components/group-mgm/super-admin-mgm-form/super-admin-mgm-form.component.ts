import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {OwnerService} from '../../../../../../shared/services/owner.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../../../shared/services/sweet-alert.service';


// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-super-admin-mgm-form',
  templateUrl: './super-admin-mgm-form.component.html',
  styleUrls: ['./super-admin-mgm-form.component.scss']
})
export class SuperAdminMgmFormComponent implements OnInit {
  adminForm: FormGroup;
  prefixList: any;
  submitted = false;
  pwdVisible = true;
  loading = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private sweetAlertService: SweetAlertService,
    private ownerService: OwnerService,
    private matDialogRef: MatDialogRef<SuperAdminMgmFormComponent>,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data) {
  }
  title = this.translateService.instant('OWNER.ADD_ADMIN');
  ngOnInit() {
    this.adminForm = this.fb.group({
      id: null,
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
      username: [null, Validators.required],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      mobile: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[0-9]+$/)])],
    });

    if (this.data.account) {
   this.title = this.translateService.instant('OWNER.EDIT_ADMIN');
  this.adminForm.patchValue(this.data.account);
    }
  }



  submit() {
    this.submitted = true;
    if (!this.adminForm.valid) {
      this.sweetAlertService.notification(this.translateService.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.loading.next(true);
    this.ownerService.addOrUpdateSuperAdmin(this.adminForm.value)
      .pipe(finalize(() => this.loading.next(false)))
      .subscribe(e => {
        this.matDialogRef.close(true);
      }, (err: HttpErrorResponse) => {
        if (err.error.message.includes('ConstraintViolationException')) {
          this.matSnackBar.open(this.translateService.instant('ADMIN.GROUP.USERNAME_EXISTS_ERROR'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar',
          });
        }
      });
  }
}
