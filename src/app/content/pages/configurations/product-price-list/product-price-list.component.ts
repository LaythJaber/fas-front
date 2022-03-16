import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {LocalStorageService} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {LazyRequest} from '../../../../shared/dto/lazy-request';
import {PriceListService} from '../../../../shared/services/price-list.service';
import {PriceList} from '../../../../shared/models/price-list';
import {ProductPriceListFormComponent} from './product-price-list-form/product-price-list-form.component';

@Component({
  selector: 'app-product-price-list',
  templateUrl: './product-price-list.component.html',
  styleUrls: ['./product-price-list.component.scss']
})
export class ProductPriceListComponent implements OnInit {


  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.DESCRIPTION',
  ];

  rows: PriceList[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize = 10;
  page = 1;
  unsubscribe = new Subject();
  loading = true;
  firstCall = true;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(private priceListService: PriceListService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyPrice({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyPrice({page: 1, pageSize: this.pageSize, textSearch: text});
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
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'BRANDS']);
  }

  getLazyPrice(request: LazyRequest) {
    this.loading = true;
    return this.priceListService.searchPriceList(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(ProductPriceListFormComponent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyPrice({page: 1, pageSize: this.pageSize});
      }
    });
  }

  openEditPrice(b: PriceList, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(ProductPriceListFormComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: true, brand: b}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyPrice({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyPrice({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }

}
