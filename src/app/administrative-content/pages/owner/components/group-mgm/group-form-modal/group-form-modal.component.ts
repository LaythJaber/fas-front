import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OwnerService} from '../../../../../../shared/services/owner.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../../../shared/services/sweet-alert.service';
import {LicenseConfigurationService} from '../../../../../../shared/services/license-configuration.service';


// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-group-form-modal',
  templateUrl: './group-form-modal.component.html',
  styleUrls: ['./group-form-modal.component.scss']
})
export class GroupFormModalComponent implements OnInit {

  groupForm: FormGroup;
  submitted = false;
  prefixList;
  pwdVisible = false;
  loading = new BehaviorSubject<boolean>(false);
  licensesConfigurations: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ownerService: OwnerService,
    private matDialogRef: MatDialogRef<GroupFormModalComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private sweetAlertService: SweetAlertService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private licenseConfigurationService: LicenseConfigurationService
  ) {
  }

  ngOnInit() {
    this.http.get<any[]>('/assets/TEL_PREFIX.json').subscribe(d => this.prefixList = d.map(e => {
      e.label = `${e.country}: ${e.prefix}`;
      return e;
    }));
    this.licenseConfigurationService.getLazyLicensesConfigurations({used: false}).subscribe(d => {
      this.licensesConfigurations = d;
    });
    this.groupForm = this.fb.group({
      id: null,
      name: [null, Validators.required],
      description: null,
      licenseConfigurationId: [null, Validators.required],
      superAdmin: this.fb.group({
        id: null,
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [null, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
        username: [null, Validators.required],
        password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
        mobilePrefix: ['+39', Validators.required],
        mobile: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^[0-9]+$/)])]
      })
    });
    if (this.data.editMode) {
      this.groupForm.removeControl('superAdmin');
      this.groupForm.patchValue(this.data.group);
    }
  }

  get superAdmin() {
    return this.groupForm.get('superAdmin') as FormGroup;
  }

  saveGroup() {
    this.submitted = true;
    if (!this.groupForm.valid) {
      this.sweetAlertService.notification(this.translateService.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.loading.next(true);
    if (!this.data.editMode) {
      this.ownerService.addGroup(this.groupForm.value).pipe(finalize(() => this.loading.next(false))).subscribe(d => {
        this.matDialogRef.close(d);
      }, (error: HttpErrorResponse) => {
        if (error.error.message.includes('ConstraintViolationException')) {
          this.matSnackBar.open(this.translateService.instant('ADMIN.GROUP.USERNAME_EXISTS_ERROR'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar',
          });
        }
      });
    }
    if (this.data.editMode) {
      this.ownerService.updateGroup(this.groupForm.value).pipe(finalize(() => this.loading.next(false))).subscribe(d => {
        this.matDialogRef.close(true);
      }, (error: HttpErrorResponse) => {
        if (error.error.message.includes('ConstraintViolationException')) {
          this.matSnackBar.open(this.translateService.instant('ADMIN.GROUP.USERNAME_EXISTS_ERROR'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar',
          });
        }
      });
    }
  }
}
