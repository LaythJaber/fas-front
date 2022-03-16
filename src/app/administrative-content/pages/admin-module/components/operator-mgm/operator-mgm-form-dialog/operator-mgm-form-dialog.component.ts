import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {finalize, takeUntil} from 'rxjs/operators';
import {SequenceType} from '../../../../../../shared/enum/sequence-type.enum';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ZipCodeService} from '../../../../../../shared/services/zip-code.service';
import {OperatorMgmService} from '../../../../../../shared/services/operator-mgm.service';
import {SequenceService} from '../../../../../../shared/services/sequence.service';
import {Subject} from 'rxjs';
import {Operator} from '../../../../../../shared/models/operator';
import {ZipCode} from '../../../../../../shared/models/zip-code';
import * as Inputmask from 'inputmask';
import {SellPointService} from '../../../../../../shared/services/sell-point.service';
import {SellPoint} from '../../../../../../shared/models/sell-point';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RoleService} from '../../../../../../shared/services/role.service';
import {Role} from '../../../../../../shared/models/role';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../../../shared/services/sweet-alert.service';
import {BarCodeMgmService} from '../../../../../../shared/services/bar-code-mgm.service';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-user-mgm-form-dialog',
  templateUrl: './operator-mgm-form-dialog.component.html',
  styleUrls: ['./operator-mgm-form-dialog.component.scss']
})
export class OperatorMgmFormDialogComponent implements OnInit, OnDestroy {
  @ViewChild('dateOfBirthElm') dateOfBirthElm: ElementRef;
  @ViewChild('dialogContent') dialogContent: ElementRef;
  // tslint:disable-next-line:max-line-length
  patternFiscal = '^([A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1})$|([0-9]{11})$';
  editMode = false;
  operatorForm: FormGroup;
  submitted = false;
  operator: Operator;
  showPass = false;
  planningColor = '#642222';
  type = 'password';
  prefixList: any[] = [];
  countryFormControl = new FormControl(null);
  provinceFormControl = new FormControl();
  cityFormControl = new FormControl();
  unsubscribe$ = new Subject();
  zipCodeList: ZipCode[] = [];
  zipCodeLoading;
  currentSeq = 0;
  sellPointsList: SellPoint[] = [];
  roles: Role[] = [];
  sellPointsFormControl = new FormControl([], Validators.required);
  loading = false;

  constructor(
    private fb: FormBuilder, private http: HttpClient, private zipCodeService: ZipCodeService,
    private operatorService: OperatorMgmService, private sequence: SequenceService,
    private dialogRef: MatDialogRef<OperatorMgmFormDialogComponent>,
    private sellPointService: SellPointService,
    private roleService: RoleService,
    private matSnackBar: MatSnackBar,
    private sweetAlertService: SweetAlertService,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private barcodeService: BarCodeMgmService
  ) {
  }

  ngOnInit() {
    this.initForms();
    this.setDateMask();
    this.http.get<any[]>('/assets/TEL_PREFIX.json').subscribe(d => this.prefixList = d.map(e => {
      e.label = `${e.country}: ${e.prefix}`;
      return e;
    }));
    this.roleService.getAllRoles().subscribe(d => {
      this.roles = d;
    });
    if (this.data.editMode) {
      this.operatorForm.patchValue(this.data.operator);
      this.sellPointsFormControl.setValue([...this.data.sellPoints]);
      this.operatorForm.get('mobilePrefix').setValue(this.data.operator.mobilePrefix || '+39');
      this.operatorForm.get('roleId').setValue(this.data.operator.role ? this.data.operator.role.id : null);
      this.operatorForm.get('zipCodeId').setValue(this.data.operator.zipCode ? this.data.operator.zipCode.id : null);
      this.planningColor = this.data.operator.planningColor;
      if (this.data.operator.zipCode) {
        this.countryFormControl.setValue(this.data.operator.zipCode ? this.data.operator.zipCode.country : null);
        this.zipCodeService.getAllZipCodesByCountry(this.data.operator.zipCode.country).subscribe(d => {
          this.zipCodeList = d;
          const zc = d.filter(e => e.id === this.data.operator.zipCode.id)[0];
          this.operatorForm.get('zipCodeId').enable();
          this.operatorForm.get('zipCodeId').setValue(this.data.operator.zipCode.id);
          this.operatorForm.get('zipCodeId').disable();
          this.setProvinceAndCity(zc);
        });
      }
      this.operatorForm.get('confirmPassword').setValue(this.data.operator.password);
    } else {
      this.sequence.getCurrentSequence(SequenceType.OPERATOR).subscribe(res => {
        this.currentSeq = res + 1;
      });
    }
    this.sellPointService.getAllSellPoints().subscribe(d => {
      this.sellPointsList = d;
    });
    this.sellPointsFormControl.valueChanges.subscribe(d => {
      this.dialogContent.nativeElement.scrollTop = this.dialogContent.nativeElement.scrollHeight;
    });
  }

  save() {
    // this.operatorForm.controls.planningColor.setValue(this.planningColor);
    this.submitted = true;
    let sellPoints;
    if (this.sellPointsFormControl.value) {
      sellPoints = this.sellPointsFormControl.value.map(e => e.id);
    }
    if (!this.operatorForm.valid || !this.sellPointsFormControl.valid) {
      this.sweetAlertService.notification(this.translateService.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (!this.data.editMode) {
      this.loading = true;
      this.operatorService.addNewOperator({...this.operatorForm.getRawValue(), sellPointIds: sellPoints})
        .pipe(finalize(() => this.loading = false
        )).subscribe(d => {
        if (d.status === 200) {
          this.dialogRef.close(true);
        }
      }, (err: HttpErrorResponse) => {
        if (err.error.message.includes('ConstraintViolationException')) {
          this.matSnackBar.open(this.translateService.instant('ADMIN.GROUP.USERNAME_EXISTS_ERROR'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar',
          });
        }
      });
    } else {
      this.loading = true;
      this.operatorService.editOperator({
        ...this.operatorForm.getRawValue(),
        sellPointIds: sellPoints
      }).pipe(finalize(() => this.loading = false
      )).subscribe(d => {
        if (d.status === 200) {
          this.dialogRef.close(true);
        }
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

  initForms() {
    this.operatorForm = new FormBuilder().group({
      id: new FormControl(),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, Validators.required),
      barCode: new FormControl(null),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      fiscalCode: new FormControl(null, Validators.pattern(this.patternFiscal)),
      dateOfBirth: new FormControl(null),
      mobile: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{8}[0-9]*/)]),
      mobilePrefix: new FormControl('+39', [Validators.required]),
      email: new FormControl(null, Validators.pattern(EMAIL_REGEX)),
      roleId: new FormControl(null, Validators.required),
      visible: new FormControl(true),
      address: new FormControl(null),
      city: new FormControl(null),
      street: new FormControl(null),
      zipCodeId: new FormControl(null)
    }, {validator: this.matchPasswords('password', 'confirmPassword')});
    this.operatorForm.get('zipCodeId').disable();
    this.provinceFormControl.disable();
    this.cityFormControl.disable();
    this.countryFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      if (c && !this.countryFormControl.disabled) {
        this.operatorForm.get('zipCodeId').enable();
        this.zipCodeLoading = true;
        this.zipCodeService.getAllZipCodesByCountry(c).subscribe(d => {
          this.zipCodeList = d;
          this.zipCodeLoading = false;
        });
      } else if (!c) {
        this.provinceFormControl.setValue(null);
        this.cityFormControl.setValue(null);
        this.operatorForm.get('zipCodeId').setValue(null);
        this.operatorForm.get('zipCodeId').disable();
      }
    });
    this.operatorForm.get('zipCodeId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
      this.provinceFormControl.setValue(null);
      this.cityFormControl.setValue(null);
      if (d && this.zipCodeList.length > 0) {
        const zc = this.zipCodeList.filter(e => e.id === d)[0];
        this.setProvinceAndCity(zc);
      }
    });
    Object.keys(this.operatorForm.controls).forEach(e => {
      if (this.operatorForm.get(e).getError('required')) {
        const el = document.querySelector('[formControlName="' + e + '"]');
        el.classList.add('required-field');
      }
    });
  }

  setProvinceAndCity(zc) {
    this.provinceFormControl.enable();
    this.cityFormControl.enable();
    this.provinceFormControl.setValue(zc.province);
    this.cityFormControl.setValue(zc.city);
    this.provinceFormControl.disable();
    this.cityFormControl.disable();
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
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

  generateBarCode() {
    /*if (this.editMode) {
      return;
    }
    let uuid = UUID().replace(/-/g, '');
    uuid = uuid.slice(2, 11);
    uuid = uuid.toUpperCase() + ('0000' + this.currentSeq).slice(-4);
    this.operatorForm.get('barCode').setValue(uuid);*/
    this.barcodeService.generateEAN13({
      id: this.operator ? this.operator.id : null,
      type: 'OPERATOR'
    }).subscribe(s => {
      this.operatorForm.get('barCode').setValue(s);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'gg/mm/aaaa'
    }).mask(this.dateOfBirthElm.nativeElement);
  }

  capSearch(term: string, item: ZipCode) {
    term = term.toLowerCase();
    return item.city.toLowerCase().startsWith(term) || item.cap.toLowerCase().startsWith(term);
  }

  removeSellPoint(i: number) {
    this.sellPointsFormControl.value.splice(i, 1);
    this.sellPointsFormControl.setValue(this.sellPointsFormControl.value);
  }
}
