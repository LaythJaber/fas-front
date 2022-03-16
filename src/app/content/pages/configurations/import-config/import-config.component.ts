import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {EnterpriseService} from '../../../../shared/services/enterprise.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImportEnterpriseModel, ProductToImport} from '../../../../shared/enum/import-enterprise-model';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {ImportationService} from '../../../../shared/services/importation.service';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {OperatorMgmComponent} from '../../../../administrative-content/pages/admin-module/components/operator-mgm/operator-mgm.component';
import {ImportEnterpriseConfig} from '../../../../shared/models/import-enterprise-config';
import {AuthService} from '../../../../shared/services/auth-jwt.service';
import {UserService} from '../../../../shared/services/user.service';
import {ImportType} from '../../../../shared/enum/import-type';
import {HttpClient} from '@angular/common/http';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {PriceList} from '../../../../shared/models/price-list';
import {PriceListService} from '../../../../shared/services/price-list.service';

@Component({
  selector: 'app-import-config',
  templateUrl: './import-config.component.html',
  styleUrls: ['./import-config.component.scss']
})
export class ImportConfigComponent implements OnInit {
  importConfigForm: FormGroup;
  prefixList = [];
  types = [];
  productToImport = [];
  private formBuilder = new FormBuilder();
  unsubscribe$ = new Subject();
  importPerDay = 1;
  hours = [{index: 1, value: '00:00'}];
  selectedIndex: number;
  selectedHour: string;
  config: ImportEnterpriseConfig;
  disableSave = false;
  datePickerForm = new FormControl('00:00');
  datePickerSMS = new FormControl('00:00');
  disableReplicate = false;
  selectedPrice = null;
  priceList: PriceList[] = [];

  constructor(
    private matDialog: MatDialog, private priceListService: PriceListService,
    private importService: ImportationService,
    private translate: TranslateService,
    private sweetAlertService: SweetAlertService,
    private http: HttpClient, private breadcrumbService: BreadcrumbService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    // this.importService.replicateDb().subscribe(r => {
    //   console.log(r);
    // });
    this.breadcrumbService.sendBreadcrumb(['IMPORT', 'IMPORT_CONFIG']);
    this.translateTypes();
    this.translateProductTypes();
    this.initImportConfigForm(this.userService.getUser().centerId);
    this.importService.getImportConfig().subscribe(c => {
      this.config = c;
      if (c && c.ipServer) {
        this.priceListService.searchPriceList({page: 1, pageSize: 100}).subscribe(pr => {
          this.priceList = pr.data;
        });
      }
      this.importConfigForm.patchValue(c);
      this.importPerDay = c.importPerDay;
      console.log(this.config);
      this.hours = [];
      let i = 0;
      c.hours.forEach(h => {
        this.hours = [...this.hours, {index: i++, value: h.substring(0, 5)}];
      });
    });

    this.http.get<any[]>('/assets/TEL_PREFIX.json').subscribe(d => this.prefixList = d.map(element => {
      element.label = `${element.country}: ${element.prefix}`;
      return element;
    }));

  }

  initImportConfigForm(entId) {
    this.importConfigForm = this.formBuilder.group({
      deactivate: new FormControl(false),
      ipServer: new FormControl(null, Validators.required),
      port: new FormControl(null, Validators.required),
      isHTTPS: new FormControl(false, Validators.required),
      model: new FormControl(null, Validators.required),
      enterpriseId: new FormControl(entId, Validators.required),
      importPerDay: new FormControl(1, Validators.required),
      hours: new FormControl(null, Validators.required),
      username: new FormControl(null),
      password: new FormControl(null),
      importedPriceListId: new FormControl(null),
      mobilePrefix: new FormControl(null),
      sentSmsAt: new FormControl(null),
      mobile: new FormControl(null),
      email: new FormControl(null, Validators.email),
      notificationSms: new FormControl(null),
      notificationMail: new FormControl(null),
      couchIpServer: new FormControl(null),
      couchPort: new FormControl(null),
      couchDb: new FormControl(null),
      couchUsername: new FormControl(null),
      couchPassword: new FormControl(null),
      isCouchHTTPS: new FormControl(false),
      productToImport: new FormControl(null),
    });

    this.importConfigForm.get('model').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
      if (d && d === ImportEnterpriseModel.SELL_POINT) {
        this.importConfigForm.get('username').setValidators(Validators.required);
        this.importConfigForm.get('password').setValidators(Validators.required);
        this.importConfigForm.get('productToImport').setValidators(Validators.required);
      } else {
        this.importConfigForm.get('username').setValidators(null);
        this.importConfigForm.get('password').setValidators(null);
        this.importConfigForm.get('productToImport').setValidators(null);
      }
      // this.importConfigForm.get('')
    });
    this.importConfigForm.get('notificationMail').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
      if (d) {
        this.importConfigForm.get('email').setValidators([Validators.required, Validators.email]);
        this.importConfigForm.get('email').enable();
      } else {
        this.importConfigForm.get('email').setValidators(null);
        this.importConfigForm.get('email').disable();

      }
      this.importConfigForm.get('email').updateValueAndValidity();
    });

    this.importConfigForm.get('notificationSms').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
      if (d) {
        this.importConfigForm.get('mobilePrefix').setValidators(Validators.required);
        this.importConfigForm.get('mobile').setValidators(Validators.required);
        this.importConfigForm.get('sentSmsAt').setValidators(Validators.required);
        this.importConfigForm.get('mobilePrefix').enable();
        this.importConfigForm.get('mobile').enable();
        this.importConfigForm.get('sentSmsAt').enable();
      } else {
        this.importConfigForm.get('mobilePrefix').setValidators(null);
        this.importConfigForm.get('mobile').setValidators(null);
        this.importConfigForm.get('sentSmsAt').setValidators(null);
        this.importConfigForm.get('mobilePrefix').disable();
        this.importConfigForm.get('mobile').disable();
        this.importConfigForm.get('sentSmsAt').disable();

      }
      this.importConfigForm.get('mobilePrefix').updateValueAndValidity();
      this.importConfigForm.get('mobile').updateValueAndValidity();
      this.importConfigForm.get('sentSmsAt').updateValueAndValidity();
    });
    this.importConfigForm.get('importPerDay').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
      if (d) {
        this.hours = [];
        // if (d > this.importPerDay) {
        this.importPerDay = d;
        // @ts-ignore
        const t = Array(d).fill().map((x, i) => i);
        t.forEach(i => {
          if (this.config && this.config.hours && this.config.hours[i]) {
            this.hours = [...this.hours, {index: i, value: this.config.hours[i].substring(0, 5)}];
          } else {
            this.hours = [...this.hours, {index: i, value: '00:00'}];
          }
        });
        // }
      }
    });
  }


  saveImportConfig(contentPriceList) {
    const hours = this.hours.map(h => h.value);
    this.importConfigForm.get('enterpriseId').setValue(this.userService.getUser().centerId);
    this.importConfigForm.get('hours').setValue(hours);
    if (!this.importConfigForm.valid) {
      this.sweetAlertService.danger(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION'));
      return;
    }
    this.disableSave = true;
    this.importService.test(this.importConfigForm.value).subscribe(v => {
      if (v) {
        this.importService.saveImportConfig(this.importConfigForm.getRawValue()).subscribe(r => {
          this.disableSave = false;
          this.priceListService.searchPriceList({page: 1, pageSize: 100}).subscribe(pr => {
            this.priceList = pr.data;
            if (this.priceList.length) {
              this.matDialog.open(contentPriceList, {width: '450px'});
            }
          });
          this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
        }, error => {
          this.disableSave = false;
          this.sweetAlertService.danger(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'));
        });
      } else {
        this.disableSave = false;
        this.sweetAlertService.danger(this.translate.instant('DIALOG.INVALID_PARAM'));
      }
    }, error => {
      this.disableSave = false;
      this.sweetAlertService.danger(this.translate.instant('DIALOG.INVALID_PARAM'));
    });

  }

  test() {
    this.disableSave = true;
    this.importService.test(this.importConfigForm.value).subscribe(v => {
      this.disableSave = false;
      if (v) {
        this.sweetAlertService.success(this.translate.instant('DIALOG.VALID_PARAM'));
      } else {
        this.sweetAlertService.danger(this.translate.instant('DIALOG.INVALID_PARAM'));
      }
    }, error => {
      this.disableSave = false;
      this.sweetAlertService.danger(this.translate.instant('DIALOG.INVALID_PARAM'));
    });
  }

  translateTypes() {
    this.types = [
      {description: this.translate.instant('IMPORT_FORM.' + ImportEnterpriseModel.FOOD_MANAGER), id: ImportEnterpriseModel.FOOD_MANAGER},
      {description: this.translate.instant('IMPORT_FORM.' + ImportEnterpriseModel.SELL_POINT), id: ImportEnterpriseModel.SELL_POINT},
    ];
  }

  translateProductTypes() {
    this.types = [
      {description: this.translate.instant('IMPORT_FORM.' + ProductToImport.VISIBLE_ON_WEB), id: ProductToImport.VISIBLE_ON_WEB},
      {description: this.translate.instant('IMPORT_FORM.' + ProductToImport.NOT_VISIBLE_ON_WEB), id: ProductToImport.NOT_VISIBLE_ON_WEB},
      {description: this.translate.instant('IMPORT_FORM.' + ProductToImport.ALL), id: ProductToImport.ALL},
    ];
  }

  setHour(event) {
    const dat = new Date(event.value);
    const time = this.getTwo(dat.getHours()) + ':' + this.getTwo(dat.getMinutes());
    this.selectedHour = time;
    console.log(time);
  }

  getTwo(nbr): string {
    return (nbr < 10) ? '0' + nbr : '' + nbr;
  }

  fixHour(hourContent, i: number) {
    this.selectedIndex = i;
    if (this.config && this.config.hours && this.config.hours[i]) {
      this.selectedHour = this.config.hours[i];
    } else {
      this.selectedHour = '00:00';
    }
    this.datePickerForm.setValue(this.selectedHour);
    this.matDialog.open(hourContent, {width: '400px'});
  }

  saveHour() {
    this.hours[this.selectedIndex].value = this.selectedHour;
    this.selectedHour = '';
    this.matDialog.closeAll();
  }

  replicateDb() {
    this.disableReplicate = true;
    console.log('wil replicate');
    this.importService.replicateDb(this.importConfigForm.getRawValue()).subscribe(r => {
      this.disableReplicate = false;
      this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
    }, error => {
      console.log(error);
      this.disableReplicate = false;
      this.sweetAlertService.danger(this.translate.instant('DIALOG.INVALID_PARAM'));
    });
  }

  savePriceListConfig() {
    this.importService.savePriceListConfig({priceListId: this.selectedPrice}).subscribe(r => {
      this.importConfigForm.get('importedPriceListId').setValue(this.selectedPrice);
      this.matDialog.closeAll();
    });
  }
}
