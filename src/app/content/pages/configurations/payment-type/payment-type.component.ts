import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {ConfigurationsService} from '../../../../shared/services/configurations.service';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {LazyRequest} from '../../../../shared/dto/lazy-request';
import {PaymentType} from '../../../../shared/models/payment-type';
import {PaymentTypeFormModalComponent} from './payment-type-form-modal.component';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-payment-type',
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.scss']
})
export class PaymentTypeComponent implements OnInit, OnDestroy {
  columns = ['DATA_TABLE.ID', 'DATA_TABLE.DESCRIPTION'];
  rows: PaymentType[] = [];
  searchFormControl = new FormControl();
  loading = false;
  page = 1;
  totalRecords;
  pageSize;
  unsubscribe = new Subject();
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(
    private configurationsService: ConfigurationsService,
    private matDialog: MatDialog,
    private localStorageService: LocalStorageService,
    private sweetAlertService: SweetAlertService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'PAYMENT_TYPE']);
    this.getLazyPaymentType({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyPaymentType({page: 1, pageSize: this.pageSize, textSearch: text});
    });
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(PaymentTypeFormModalComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyPaymentType({page: 1, pageSize: this.pageSize});
      }
    });
  }

  getLazyPaymentType(request: LazyRequest) {
    this.loading = true;
    return this.configurationsService.getLazyPaymentType(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

  openEditProfession($event, preferredContact: any, i: number) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(PaymentTypeFormModalComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: true, prefContact: preferredContact}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyPaymentType({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  deletePaymentType($event, paymentType: PaymentType, i: number) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + paymentType.description).then(e => {
      if (e.value) {
        this.configurationsService.deletePaymentType(paymentType.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyPaymentType({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyPaymentType({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }

}
