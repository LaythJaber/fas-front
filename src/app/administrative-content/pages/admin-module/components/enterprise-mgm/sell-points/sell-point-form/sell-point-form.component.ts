import {Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ZipCode} from '../../../../../../../shared/models/zip-code';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {ZipCodeService} from '../../../../../../../shared/services/zip-code.service';
import {takeUntil} from 'rxjs/operators';
import * as Inputmask from 'inputmask';
import {SellPointService} from '../../../../../../../shared/services/sell-point.service';
import {SellPoint} from '../../../../../../../shared/models/sell-point';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../../../../shared/services/sweet-alert.service';
import { Enterprise } from 'src/app/shared/models/enterprise';
import { CustomSnackBarComponent } from 'src/app/shared/compoenent/custom-snack-bar/custom-snack-bar.component';
import { MatSnackBar } from '@angular/material';
// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-sell-point-form',
  templateUrl: './sell-point-form.component.html',
  styleUrls: ['./sell-point-form.component.scss']
})
export class SellPointFormComponent implements OnInit {
  @ViewChild('startTimeElm') startTimeElm: ElementRef;
  @ViewChild('finishTimeElm') finishTimeElm: ElementRef;
  sellPointForm: FormGroup;
  prefixList: any;
  submitted = false;
  zipCodeLoading = false;
  zipCodeList: ZipCode[] = [];
  unsubscribe$ = new Subject();
  countryFormControl = new FormControl(null);
  provinceFormControl = new FormControl();
  cityFormControl = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { editMode: boolean, enterprise?: Enterprise, sellPoint: SellPoint },
    private http: HttpClient,
    private dialogRef: MatDialogRef<SellPointFormComponent>,
    private sellPointService: SellPointService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private zipCodeService: ZipCodeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.buildSellPointForm();
    this.zipCodeManagement();
    if (this.data.editMode) {
      this.sellPointForm.patchValue(this.data.sellPoint);
      this.sellPointForm.get('phonePrefix').setValue(this.data.sellPoint.phonePrefix || '+39');
      this.sellPointForm.get('mobilePrefix').setValue(this.data.sellPoint.mobilePrefix || '+39');
      this.sellPointForm.get('startHour').setValue(this.setTimeFromString(this.data.sellPoint.startHour));
      this.sellPointForm.get('finishHour').setValue(this.setTimeFromString(this.data.sellPoint.finishHour));
      if (this.data.sellPoint.zipCode) {
        this.countryFormControl.setValue(this.data.sellPoint.zipCode ? this.data.sellPoint.zipCode.country : null);
        this.zipCodeService.getAllZipCodesByCountry(this.data.sellPoint.zipCode.country).subscribe(d => {
          this.zipCodeList = d;
          const zc = d.filter(e => e.id === this.data.sellPoint.zipCode.id)[0];
          this.sellPointForm.get('zipCodeId').enable();
          this.sellPointForm.get('zipCodeId').setValue(this.data.sellPoint.zipCode.id);
          this.setProvinceAndCity(zc);
        });
      }
    }
    this.http.get<any[]>('/assets/TEL_PREFIX.json').subscribe(d => this.prefixList = d.map(e => {
      e.label = `${e.country}: ${e.prefix}`;
      return e;
    }));

    if (!this.data.editMode) {
      this.sellPointForm.get('name').setValue(this.data.enterprise.companyName);
      this.sellPointForm.get('address').setValue(this.data.enterprise.address);
      this.sellPointForm.get('street').setValue(this.data.enterprise.street);
      this.sellPointForm.get('email').setValue(this.data.enterprise.email);

      if (this.data.enterprise.zipCode) {
        this.countryFormControl.setValue(this.data.enterprise.zipCode ? this.data.enterprise.zipCode.country : null);
        this.zipCodeService.getAllZipCodesByCountry(this.data.enterprise.zipCode.country).subscribe(d => {
          this.zipCodeList = d;
          const zc = d.filter(e => e.id === this.data.enterprise.zipCode.id)[0];
          this.sellPointForm.get('zipCodeId').enable();
          this.sellPointForm.get('zipCodeId').setValue(this.data.enterprise.zipCode.id);
          this.setProvinceAndCity(zc);
        });
      }
    }

    this.setTimerMasks();
  }


  private zipCodeManagement() {
    this.sellPointForm.get('zipCodeId').disable();
    this.provinceFormControl.disable();
    this.cityFormControl.disable();
    this.countryFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      if (c && !this.countryFormControl.disabled) {
        this.sellPointForm.get('zipCodeId').enable();
        this.zipCodeLoading = true;
        this.zipCodeService.getAllZipCodesByCountry(c).subscribe(d => {
          this.zipCodeList = d;
          this.zipCodeLoading = false;
        });
      } else if (!c) {
        this.provinceFormControl.setValue(null);
        this.cityFormControl.setValue(null);
        this.sellPointForm.get('zipCodeId').setValue(null);
        this.sellPointForm.get('zipCodeId').disable();
      }
    });
    this.sellPointForm.get('zipCodeId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
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

  private buildSellPointForm() {
    const sDate = new Date();
    sDate.setHours(8);
    sDate.setMinutes(30);
    const fDate = new Date();
    fDate.setHours(19);
    fDate.setMinutes(30);
    this.sellPointForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl(null, Validators.required),
      address: new FormControl(null),
      street: new FormControl(null),
      zipCodeId: new FormControl(null),
      phone: new FormControl(null, Validators.pattern('^[0-9]{8}[0-9]*')),
      phonePrefix: new FormControl('+39'),
      mobile: new FormControl(null,  Validators.pattern('^[0-9]{8}[0-9]*')),
      mobilePrefix: new FormControl('+39'),
      email: new FormControl(null,  Validators.pattern(EMAIL_REGEX)),
      contact: new FormControl(null),
      planningType: new FormControl(null),
      startHour: new FormControl(sDate),
      finishHour: new FormControl(fDate),
      description: new FormControl(null),
      note: new FormControl()
    });


    Object.keys(this.sellPointForm.controls).forEach(e => {
      if (this.sellPointForm.get(e).getError('required')) {
        const el = document.querySelector('[formControlName="' + e + '"]');
        el.classList.add('required-field');
      }
    });
  }

  private setTimerMasks() {
    Inputmask('datetime', {
      inputFormat: 'HH:MM',
      placeholder: '--:--'
    }).mask(this.startTimeElm.nativeElement);
    Inputmask('datetime', {
      inputFormat: 'HH:MM',
      placeholder: '--:--'
    }).mask(this.finishTimeElm.nativeElement);
  }

  saveSellPoint() {
    this.submitted = true;
    if (!this.sellPointForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (!this.data.editMode) {
      console.log('add');
      this.sellPointService.addSellPoint(this.sellPointForm.value, this.data.enterprise.id).subscribe(d => {
        this.dialogRef.close(d);
      } , e=> {
        this.showSnackBar({
          text: ``,
          actionIcon: 'failed',
          actionMsg: this.translate.instant('DIALOG.CANNOT_DELETE')
        });
      });
    } else {
      console.log('edit');
      this.sellPointService.editSellPoint(this.sellPointForm.value).subscribe(d => {
        this.dialogRef.close(d);
      });
    }
  }

  showSnackBar(data: any) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data,
      duration: 5000,
      panelClass: 'white-snackbar'
    });
  }


  /*@HostListener('document:keypress', ['$event'])
  SubmitToFormOnEnter($event: KeyboardEvent) {
    console.log($event);
  }*/
  setTimeFromString(str) {
    if (!str) {
      return;
    }
    const s = str.substr(0, 5).split(':');
    const d = new Date();
    d.setHours(Number(s[0]));
    d.setMinutes(Number(s[1]));
    return d;
  }
}
