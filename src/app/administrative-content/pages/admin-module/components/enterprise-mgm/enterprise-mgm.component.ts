import {MatSnackBar} from '@angular/material/snack-bar';
import {takeUntil} from 'rxjs/operators';
import {SweetAlertService} from 'src/app/shared/services/sweet-alert.service';
import {TranslateService} from '@ngx-translate/core';
import {GroupConfigurationService} from './../../../../../shared/services/group-configuration.service';
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {OperatorMgmComponent} from '../operator-mgm/operator-mgm.component';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {Location} from '@angular/common';
import {UserService} from '../../../../../shared/services/user.service';
import {EnterpriseService} from 'src/app/shared/services/enterprise.service';
import {Enterprise} from 'src/app/shared/models/enterprise';
import {EnterpriseMgmFormComponent} from './enterprise-mgm-form/enterprise-mgm-form.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OwnerService} from '../../../../../shared/services/owner.service';
import {RechargeRecoveryCriteria} from 'src/app/shared/enum/recharge-recovery-criteria.enum';
import {PriceRecoveryCriteria} from 'src/app/shared/enum/price-recovery-criteria.enum';
import {ProductBarcodeType} from '../../../../../shared/enum/product-barcode-type';
import {ImportEnterpriseModel} from '../../../../../shared/enum/import-enterprise-model';
import {HttpClient} from '@angular/common/http';
import {GroupWithSuperAdmins} from '../../../../../shared/models/group';

@Component({
  selector: 'app-enterprise-mgm',
  templateUrl: './enterprise-mgm.component.html',
  styleUrls: ['./enterprise-mgm.component.scss']
})
export class EnterpriseMgmComponent implements OnInit {
  enterprisesList: Enterprise[] = [];
  enterpriseUuid;
  loading = false;
  private unsubscribe$ = new Subject();
  public isOwner: boolean;
  configForm: FormGroup;
  private formBuilder = new FormBuilder();
  dialogRef: any;
  rechargeCriterias: any[] = [];
  saleCriterias: any[] = [];
  importConfigForm: FormGroup;
  types = [];
  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.FIRST_NAME',
    'DATA_TABLE.IVA',
    'DATA_TABLE.CODE',
    'DATA_TABLE.EMAIL',
    ''
  ];
  tableColumns = [
    '',
    'DATA_TABLE.USERNAME',
    'DATA_TABLE.FIRST_NAME',
    'DATA_TABLE.LAST_NAME',
    'DATA_TABLE.MOBILE',
    ''
  ];
  selectedEnt: Enterprise;
  modalRef: any;

  constructor(
    private matDialog: MatDialog,
    private enterpriseService: EnterpriseService,
    private router: Router,
    private location: Location,
    public userService: UserService,
    private groupConfigurationService: GroupConfigurationService,
    private groupService: OwnerService,
    private translate: TranslateService,
    private sweetAlertService: SweetAlertService,
    private translateService: TranslateService,
    private matSnackBar: MatSnackBar, private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.isOwner = this.userService.getUser().authorities.some(u => u === 'OWNER');
    /*  this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.location.path() === '/admin') {
            this.enterpriseService.getAllEnterprises().subscribe(d => {
              this.enterprisesList = d;
              if (d.length > 0) {
                this.router.navigate(['/admin/enterprise']);
              }
            });
          }
        }
      });*/
    this.loading = true;
    this.loadEnterprises();
    this.configForm = this.formBuilder.group({
      rechargeCriteria: new FormControl(null, Validators.required),
      priceCriteria: new FormControl(null, Validators.required),
      customRecharge: new FormControl(null, Validators.required)
    });


    this.translateSaleCriterias();
    this.translateRechargeCriterias();
    this.configForm.get('rechargeCriteria').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      if (r === 'CUSTOM') {
        this.configForm.get('customRecharge').setValidators(Validators.required);
        this.configForm.get('customRecharge').updateValueAndValidity();
      } else {
        this.configForm.get('customRecharge').setValue(null);
        this.configForm.get('customRecharge').setValidators(null);
        this.configForm.get('customRecharge').updateValueAndValidity();
      }
    });


  }

  loadEnterprises() {
    this.enterpriseService.getAllEnterprises().subscribe(d => {
      this.enterprisesList = d;
      this.loading = false;
      /* if (d.length > 0) {
         this.router.navigate(['/admin/enterprise', d[0].id]);
       }*/
    });
  }

  openManageUsers() {
    this.matDialog.open(OperatorMgmComponent, {width: '1100px', data: {openedForm: 'ENTERPRISE'}});
  }

  openAddEnterpriseForm() {
    const dialogRef = this.matDialog.open(EnterpriseMgmFormComponent, {
      width: '1200px',
      closeOnNavigation: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.loading = true;
        this.enterpriseService.getAllEnterprises().subscribe(u => {
          this.enterprisesList = u;
          this.loading = false;
        });
      }
    });
  }

  deleteEnterprise($event: MouseEvent, enterprise) {
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE')).then(e => {
      if (e.value) {
        $event.cancelBubble = true;
        $event.stopPropagation();
        this.enterpriseService.deleteEnterprise(enterprise.id).subscribe(d => {
        }, er => {
          this.matSnackBar.open(this.translateService.instant('ADMIN.SELL_POINT.CANNOT_DELETE'), 'Ok', {
            duration: 5000,
            panelClass: 'white-snackbar',
          });
        });
      }
    });
  }

  openEditEnterprise($event: MouseEvent, enterprise) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(EnterpriseMgmFormComponent, {width: '1200px', data: {editMode: true, enterprise}});
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.loading = true;
        this.enterpriseService.getAllEnterprises().subscribe(u => {
          this.enterprisesList = u;
          const url = this.router.url;
          this.router.navigate(['/admin'], {skipLocationChange: true}).then(() => {
            this.router.navigate([url]);
          });
          this.loading = false;
        });
      }
    });
  }

  openConfiguration(content) {
    this.groupService.getCurrentGroup().subscribe(r => {
      this.configForm.patchValue(r);
      this.dialogRef = this.matDialog.open(content, {
        width: '80%',
        autoFocus: true,
        disableClose: true,
      });
      this.dialogRef.afterClosed().subscribe(d => {
        console.log(d);
        //  if (d) {
        this.dialogRef.close();
        //   }
      });
    });

  }

  saveConfiguration() {

    if (!this.configForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.groupService.saveConfiguration(this.configForm.getRawValue()).subscribe(r => {
      console.log(r);
      this.dialogRef.close(null);
    });

  }


  translateRechargeCriterias() {
    this.rechargeCriterias = [
      {description: this.translate.instant('PRODUCT_FORM.' + RechargeRecoveryCriteria.NOTHING), id: RechargeRecoveryCriteria.NOTHING},
      {description: this.translate.instant('PRODUCT_FORM.' + RechargeRecoveryCriteria.RECHARGE), id: RechargeRecoveryCriteria.RECHARGE},
      {
        description: this.translate.instant('PRODUCT_FORM.' + RechargeRecoveryCriteria.RECHARGE_SALE),
        id: RechargeRecoveryCriteria.RECHARGE_SALE
      },
      {description: this.translate.instant('PRODUCT_FORM.' + RechargeRecoveryCriteria.CUSTOM), id: RechargeRecoveryCriteria.CUSTOM}
    ];
  }

  translateSaleCriterias() {
    this.saleCriterias = [
      {description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.NOTHING), id: PriceRecoveryCriteria.NOTHING},
      {description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.PRICE), id: PriceRecoveryCriteria.PRICE},
      {description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.PRICE_OF_SALE), id: PriceRecoveryCriteria.PRICE_OF_SALE},
      {
        description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.VALUE_PRICE_LAST_SALE),
        id: PriceRecoveryCriteria.VALUE_PRICE_LAST_SALE
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_SALE),
        id: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_SALE
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_SALE_MOV),
        id: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_SALE_MOV
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.VALUE_PRICE_LAST_PURCH),
        id: PriceRecoveryCriteria.VALUE_PRICE_LAST_PURCH
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_PURCH),
        id: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_PURCH
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.VALUE_PRICE_LOW_PURCH),
        id: PriceRecoveryCriteria.VALUE_PRICE_LOW_PURCH
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + PriceRecoveryCriteria.VALUE_PRICE_MAX_PURCH),
        id: PriceRecoveryCriteria.VALUE_PRICE_MAX_PURCH
      }

    ];
  }

  /*translateRechargeCriterias() {
    this.rechargeCriterias = [
      { description: RechargeRecoveryCriteria.NOTHING, id: RechargeRecoveryCriteria.NOTHING },
      { description: RechargeRecoveryCriteria.RECHARGE, id: RechargeRecoveryCriteria.RECHARGE },
      { description: RechargeRecoveryCriteria.RECHARGE_SALE, id: RechargeRecoveryCriteria.RECHARGE_SALE },
      { description: RechargeRecoveryCriteria.CUSTOM, id: RechargeRecoveryCriteria.CUSTOM }
    ];
  }

  translateSaleCriterias() {
    this.saleCriterias = [
      { description: PriceRecoveryCriteria.NOTHING, id: PriceRecoveryCriteria.NOTHING },
      { description: PriceRecoveryCriteria.PRICE, id: PriceRecoveryCriteria.PRICE },
      { description: PriceRecoveryCriteria.PRICE_OF_SALE, id: PriceRecoveryCriteria.PRICE_OF_SALE },
      { description: PriceRecoveryCriteria.VALUE_PRICE_LAST_SALE, id: PriceRecoveryCriteria.VALUE_PRICE_LAST_SALE },
      { description: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_SALE, id: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_SALE },
      { description: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_SALE_MOV, id: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_SALE_MOV },
      { description: PriceRecoveryCriteria.VALUE_PRICE_LAST_PURCH, id: PriceRecoveryCriteria.VALUE_PRICE_LAST_PURCH },
      { description: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_PURCH, id: PriceRecoveryCriteria.VALUE_PRICE_AVERAGE_PURCH },
      { description: PriceRecoveryCriteria.VALUE_PRICE_LOW_PURCH, id: PriceRecoveryCriteria.VALUE_PRICE_LOW_PURCH },
      { description: PriceRecoveryCriteria.VALUE_PRICE_MAX_PURCH, id: PriceRecoveryCriteria.VALUE_PRICE_MAX_PURCH }

    ];
  }*/

  showEntPdv(superAdminContent, g: Enterprise, $event: MouseEvent) {
    this.selectedEnt = g;
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.modalRef = this.matDialog.open(superAdminContent, {
      disableClose: true,
      width: '900px'
    }).afterClosed().subscribe(u => {
      this.loadEnterprises();
    });
  }
}
