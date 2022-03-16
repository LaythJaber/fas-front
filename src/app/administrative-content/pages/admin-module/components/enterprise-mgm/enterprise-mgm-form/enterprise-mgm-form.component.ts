import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {ZipCodeService} from '../../../../../../shared/services/zip-code.service';
import {ZipCode} from '../../../../../../shared/models/zip-code';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import * as Inputmask from 'inputmask';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../../../shared/services/sweet-alert.service';
import {CompanyBusinessService} from '../../../../../../shared/services/company-business.service';
import { EnterpriseService } from 'src/app/shared/services/enterprise.service';
import { Enterprise } from 'src/app/shared/models/enterprise';
// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// tslint:disable-next-line:max-line-length
const patternFiscal = `^([A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1})$|([0-9]{11})$`;
@Component({
  selector: 'app-enterprise-mgm-form',
  templateUrl: './enterprise-mgm-form.component.html',
  styleUrls: ['./enterprise-mgm-form.component.scss']
})
export class EnterpriseMgmFormComponent implements OnInit, OnDestroy {
  @ViewChild('fiscalCodeElm') fiscalCodeElm: ElementRef;
  enterpriseForm: FormGroup;
  prefixList: any;
  submitted = false;
  zipCodeLoading = false;
  zipCodeList: ZipCode[] = [];
  unsubscribe$ = new Subject();
  countryFormControl = new FormControl(null);
  provinceFormControl = new FormControl();
  cityFormControl = new FormControl();
  activities = [];

  constructor(
    private enterpriseService: EnterpriseService,
    private zipCodeService: ZipCodeService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: { editMode: boolean, enterprise?: Enterprise },
    private dialogRef: MatDialogRef<EnterpriseMgmFormComponent>,
    private http: HttpClient,
    private companyBusinessService: CompanyBusinessService) {
  }

  ngOnInit() {
    this.buildEnterpriseForm();
    this.zipCodeManagement();
    this.companyBusinessService.getAllCompanyBusinesses().subscribe(data => {
      this.activities = data;
    });
    if (this.data.editMode) {
      this.enterpriseForm.patchValue(this.data.enterprise);
      this.enterpriseForm.get('businessId').setValue(this.data.enterprise.business ? this.data.enterprise.business.id : null);
      this.enterpriseForm.get('phonePrefix').setValue(this.data.enterprise.phonePrefix || '+39');
      this.enterpriseForm.get('mobilePrefix').setValue(this.data.enterprise.mobilePrefix || '+39');
      this.enterpriseForm.get('faxPrefix').setValue(this.data.enterprise.faxPrefix || '+39');
      if (this.data.enterprise.zipCode) {
        this.countryFormControl.setValue(this.data.enterprise.zipCode ? this.data.enterprise.zipCode.country : null);
        this.zipCodeService.getAllZipCodesByCountry(this.data.enterprise.zipCode.country).subscribe(d => {
          this.zipCodeList = d;
          const zc = d.filter(e => e.id === this.data.enterprise.zipCode.id)[0];
          this.enterpriseForm.get('zipCodeId').enable();
          this.enterpriseForm.get('zipCodeId').setValue(this.data.enterprise.zipCode.id);
          this.setProvinceAndCity(zc);
        });
      }
    }
    this.http.get<any[]>('/assets/TEL_PREFIX.json').subscribe(d => this.prefixList = d.map(e => {
      e.label = `${e.country}: ${e.prefix}`;
      return e;
    }));
    Inputmask({regex: '([a-zA-Z0-9]{4})'});
  }


  private buildEnterpriseForm() {
    this.enterpriseForm = new FormGroup({
      id: new FormControl(),
      companyName: new FormControl(null, Validators.required),
      vatNumber: new FormControl(null, Validators.required),
      fiscalCode: new FormControl(null,  Validators.pattern(patternFiscal)),
      sdiCode: new FormControl(null),
      rea: new FormControl(),
      address: new FormControl(null),
      street: new FormControl(null),
      zipCodeId: new FormControl(null),
      phone: new FormControl(null, [Validators.pattern('^[0-9]{8}[0-9]*')]),
      phonePrefix: new FormControl('+39'),
      mobile: new FormControl(null, [Validators.pattern('^[0-9]{8}[0-9]*')]),
      mobilePrefix: new FormControl('+39'),
      fax: new FormControl(null, [Validators.pattern('^[0-9]{8}[0-9]*')]),
      faxPrefix: new FormControl('+39'),
      email: new FormControl(null, Validators.pattern(EMAIL_REGEX)),
      contact: new FormControl(),
      website: new FormControl(null, [Validators.pattern(`^(www.)?[a-z0-9]+.[a-z]+$`)]),
      bank: new FormControl(),
      branchBank: new FormControl(),
      iban: new FormControl(),
      cin: new FormControl(),
      abi: new FormControl(),
      cab: new FormControl(),
      swift: new FormControl(),
      note: new FormControl(),
      businessId: new FormControl()
    });
    Object.keys(this.enterpriseForm.controls).forEach(e => {
      if (this.enterpriseForm.get(e).getError('required')) {
        const el = document.querySelector('[formControlName="' + e + '"]');
        el.classList.add('required-field');
      }
    });
  }

  private zipCodeManagement() {
    this.enterpriseForm.get('zipCodeId').disable();
    this.provinceFormControl.disable();
    this.cityFormControl.disable();
    this.countryFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      if (c && !this.countryFormControl.disabled) {
        this.enterpriseForm.get('zipCodeId').enable();
        this.zipCodeLoading = true;
        this.zipCodeService.getAllZipCodesByCountry(c).subscribe(d => {
          this.zipCodeList = d;
          this.zipCodeLoading = false;
        });
      } else if (!c) {
        this.provinceFormControl.setValue(null);
        this.cityFormControl.setValue(null);
        this.enterpriseForm.get('zipCodeId').setValue(null);
        this.enterpriseForm.get('zipCodeId').disable();
      }
    });
    this.enterpriseForm.get('zipCodeId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
      this.provinceFormControl.setValue(null);
      this.cityFormControl.setValue(null);
      if (d && this.zipCodeList.length > 0) {
        const zc = this.zipCodeList.filter(e => e.id === d)[0];
        this.setProvinceAndCity(zc);
      }
    });
  }

  /**
   * zip code setup
   */

  private setProvinceAndCity(zc) {
    this.provinceFormControl.enable();
    this.cityFormControl.enable();
    this.provinceFormControl.setValue(zc.province);
    this.cityFormControl.setValue(zc.city);
    this.provinceFormControl.disable();
    this.cityFormControl.disable();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  saveEnterprise() {
    this.submitted = true;
    if (!this.enterpriseForm.valid || !this.countryFormControl.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (!this.data.editMode) {
      this.enterpriseService.addNewEnterprise(this.enterpriseForm.value).subscribe(d => {
        this.dialogRef.close(d);
      });
    } else {
      this.enterpriseService.editEnterprise(this.enterpriseForm.value).subscribe(d => {
        this.dialogRef.close(d);
      });
    }
  }

  checkPIVA(): boolean {
    const pi = this.enterpriseForm.get('vatNumber').value;
    let i: number;
    let c: number;
    let s: number;
    if (pi === null || pi.length === 0) {
      return false;
    }
    if (pi.length !== 11) {
      this.enterpriseForm.controls.vatNumber.setErrors({invalid: true});
      return false;
    }
    for (i = 0; i < 11; i++) {
      {
        if ((x => x.charCodeAt == null ? x : x.charCodeAt(0))(pi.charAt(i)) < '0'.charCodeAt(0) || (x => x.charCodeAt == null ?
          x : x.charCodeAt(0))(pi.charAt(i)) > '9'.charCodeAt(0)) {
          this.enterpriseForm.controls.vatNumber.setErrors({invalid: true});
          return false;
        }
      }
    }
    s = 0;
    for (i = 0; i <= 9; i += 2) {
      s += (x => x.charCodeAt == null ? x : x.charCodeAt(0))(pi.charAt(i)) - '0'.charCodeAt(0);
    }
    for (i = 1; i <= 9; i += 2) {
      {
        c = 2 * ((x => x.charCodeAt == null ? x : x.charCodeAt(0))(pi.charAt(i)) - '0'.charCodeAt(0));
        if (c > 9) {
          c = c - 9;
        }
        s += c;
      }
    }
    if ((10 - s % 10) % 10 !== (x => x.charCodeAt == null ? x : x.charCodeAt(0))(pi.charAt(10)) - '0'.charCodeAt(0)) {
      this.enterpriseForm.controls.vatNumber.setErrors({invalid: true});
      return false;
    }
    return true;
  }
}
