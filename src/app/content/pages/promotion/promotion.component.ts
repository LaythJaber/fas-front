import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Promotion} from '../../../shared/models/promotion';
import {PromoService} from '../../../shared/services/promo.service';
import {PromoClient} from '../../../shared/models/promo-client';
import {PromoType} from '../../../shared/enum/promo-type';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {PromotionFormComponent} from './promotion-form/promotion-form.component';
import {debounceTime} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {SweetAlertService} from '../../../shared/services/sweet-alert.service';
import {PromoStatus} from '../../../shared/enum/promo-status';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import {LocalStorageService} from 'ngx-webstorage';
import {GeneralConfigurationsService} from "../../../shared/services/general-configurations.service";
import {GeneralConfigurations} from "../../../shared/models/general-configurations";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  searchFormControl = new FormControl(null);
  columns = [
    'PROMO_FORM.ID',
    'PROMO_FORM.CREATION_DATE',
    'PROMO_FORM.OBJECT',
    // 'PROMO_FORM.TYPE',
    'PROMO_FORM.SENT_DATE_HOUR',
    'PROMO_FORM.RECEIVER',
    'PROMO_FORM.STATUS',
  ];
  rows: Promotion[] = [];
  public page = 1;
  public totalRecords: number;
  public pageSize = 10;
  loading = true;
  receivers: PromoClient[] = [];
  receivs: PromoClient[] = [];
  orderType = 'DESC';
  type: PromoType;
  dialogRef: any;
  dialog_columns = [
    'SMS.RECEIVER',
    'PROMO_FORM.MAIL',
    'SMS.PHONE',
  ];
  sms_columns = [
    'SMS.STATUS',
    'SMS.SENT_AT',
  ];
  dialogSearchFormControl = new FormControl(null);
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  generalConfigurations: GeneralConfigurations;

  constructor(
    public datepipe: DatePipe,
    public snackBar: MatSnackBar,
    private promoService: PromoService,
    private translate: TranslateService,
    private matDialog: MatDialog,
    private router: Router,
    private sweetAlertService: SweetAlertService,
    private breadcrumbService: BreadcrumbService,
    private localStorageService: LocalStorageService,
    private generalConfigurationsService: GeneralConfigurationsService,
  ) {
    this.getGeneralConfigurationsDetails();
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.breadcrumbService.sendBreadcrumb(['PROMOTION']);
    this.filterPromos();
    this.searchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => this.filterPromos());
    this.dialogSearchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
      this.receivs = this.receivers;
      this.receivs = this.receivs.filter(x => ((x.firstName.toLowerCase() + ' ' +
        x.lastName.toLowerCase()).includes(s.toLowerCase()))
        || (x.mobilePrefix + x.mobile).includes(s)
        || (this.translate.instant('SMS.' + (this.receivs[0].mailStatus))).toLowerCase().includes(s.toLowerCase())
        || (x.mailSendAt && (this.datepipe.transform(x.mailSendAt, 'dd/MM/yyyy HH:mm')).includes(s))
      );
    });
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }
  addNew() {
    const dialogRef = this.matDialog.open(PromotionFormComponent, {
      width: '90%',
      height: '90%',
      autoFocus: true,
      disableClose: false,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.filterPromos();
    });
  }

  filterPromos() {
    this.promoService.filter({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value}).subscribe(r => {
      this.rows = r.data;
      this.totalRecords = r.totalRecords;
    });

  }

  openReceiversContent($event, content, promo: Promotion) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.type = promo.type;
    this.receivers = promo.promoClients;
    this.receivs = promo.promoClients;
    // this.clientRows = promo.promoClients.reverse();
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.matDialog.open(content, {
      autoFocus: false,
      width: '95%',
      maxHeight: '90vh'
    });
  }

  editPromo(promotion: Promotion) {
    const dialogRef = this.matDialog.open(PromotionFormComponent, {
      width: '90%',
      height: '90%',
      autoFocus: true,
      disableClose: false,
      data: {editMode: true, promo: promotion}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.filterPromos();
    });
  }

  annulReactivePromo($event, promo: Promotion) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    let msg = '';
    if (promo.status === 'SCHEDULED') {
      msg = this.translate.instant('DIALOG.YOU_WANT_TO_ANNUL');
      // @ts-ignore
    } else if (promo.status === PromoStatus.ANNULLED) {
      msg = this.translate.instant('DIALOG.YOU_WANT_TO_REACTIVE');
    } else {
      return;
    }
    this.sweetAlertService.warning(msg + promo.object).then(e => {
      if (e.value) {
        this.promoService.annulReactivePromo(promo.id).subscribe(r => {
          // @ts-ignore
          promo.status = promo.status === 'SCHEDULED' ? 'ANNULLED' : 'SCHEDULED';
        });
      }
    });
  }

  pageChange(page) {
    this.page = page;
    this.filterPromos();
  }

  getGeneralConfigurationsDetails() {
    this.generalConfigurationsService.getCurrentEnterpriseGeneralConfigurations()
      .subscribe((response) => {
        this.generalConfigurations = response;
        if (!this.generalConfigurations.marketingPageIndex) {
          this.sweetAlertService.notification('Devi attivare modulo di marketing').then(e => {});
        }
      })
  }
}
