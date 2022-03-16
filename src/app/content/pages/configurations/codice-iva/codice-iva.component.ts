import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {ConfigurationsService} from '../../../../shared/services/configurations.service';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {LazyRequest} from '../../../../shared/dto/lazy-request';
import {IvaCode} from '../../../../shared/models/iva-code';
import {CodiceIvaFormModalComponent} from './codice-iva-form-modal.component';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-codice-iva',
  templateUrl: './codice-iva.component.html',
  styleUrls: ['./codice-iva.component.scss']
})
export class CodiceIVAComponent implements OnInit {

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.TAX_DESCRIPTION',
    'DATA_TABLE.TAX_RATE'
  ];

  rows: IvaCode[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize = 10;
  page = 1;
  unsubscribe = new Subject();
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  loading = true;
  firstCall = true;

  constructor(private configurationsService: ConfigurationsService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyIvaCode({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyIvaCode({page: 1, pageSize: this.pageSize, textSearch: text});
    });
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'IVA_CODE']);
  }

  getLazyIvaCode(request: LazyRequest) {
    this.loading = true;
    return this.configurationsService.lazyIvaCode(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(CodiceIvaFormModalComponent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyIvaCode({page: 1, pageSize: this.pageSize});
      }
    });
  }

  deleteIvaCode(ivaCode: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') +  ivaCode.description).then(e => {
      if (e.value) {
        this.configurationsService.deleteIvaCode(ivaCode.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyIvaCode({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  openEditIvaCode(iva: IvaCode, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(CodiceIvaFormModalComponent, {
      width: '600px',
      disableClose: true,
      data: {editMode: true, ivaCode: iva}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyIvaCode({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyIvaCode({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }

}
