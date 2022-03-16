import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormArray} from '@angular/forms';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {MovementMgmService} from '../../../../shared/services/movement-mgm.service';
import {Stock} from '../../../../shared/models/stock';
import {MatDialog, MatDialogRef} from '@angular/material';
import {StockHistoryComponent} from './stock-history/stock-history.component';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.scss']
})
export class StockManagementComponent implements OnInit {
  @ViewChild('stockHistoryTemplate') stockHistoryTemplate: TemplateRef<StockHistoryComponent>;
  columns = [
    'STOCK_FORM.CREATION_DATE',
    'STOCK_FORM.CODE',
    'STOCK_FORM.DESCRIPTION',
    'STOCK_FORM.COMMERCIAL_DESCRIPTION',
    'STOCK_FORM.ACTIVE',
    'STOCK_FORM.CATEGORY',
    'STOCK_FORM.SUBCATEGORIES',
    'PRODUCT_FORM.CATEGORY_LEVEL3',
    'STOCK_FORM.STOCK',
    'PRODUCT_FORM.AVAILABILITY',
    'PRODUCT_FORM.MIN_STOCK',
    'STOCK_FORM.ML_GR',
    'STOCK_FORM.PURCHASE_COST',
    'STOCK_FORM.PRICE',
    'STOCK_FORM.IVA',
    'STOCK_FORM.BRAND',
  ];
  loading = true;
  firstCall = true;
  rows: Stock[] = [];
  searchFormControl = new FormControl(null);
  page = 1;
  totalRecords: number;
  pageSize;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  selectedStock: Stock = new Stock();
  dialogRef: any;
  colsFormArray: FormArray;
  unsubscribe = new Subject();
  editModal: MatDialogRef<unknown, any>;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private movementService: MovementMgmService,
    private matDialog: MatDialog,
    private localStorageService: LocalStorageService
  ) {
  }


  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.breadcrumbService.sendBreadcrumb(['MOVEMENT_AND_STOCK', 'STOCK']);
    this.getLazyProduct({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
      this.getLazyProduct({page: 1, pageSize: this.pageSize, textSearch: s});
    });
    this.colsFormArray = this.createColumnsForm(this.columns);
    this.colsFormArray.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(s => {
      this.localStorageService.store('cols', s);
    });
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }

  private createColumnsForm(columns) {
    if (this.localStorageService.retrieve('cols')) {
      return new FormArray(this.localStorageService.retrieve('cols').map(au => new FormControl(au)));
    }
    return new FormArray(columns.map(au => new FormControl(true)));
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyProduct({page, pageSize: this.pageSize});
  }

  getLazyProduct(request) {
    this.loading = true;
    return this.movementService.getLazyStockList(request).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
      this.firstCall = false;
      this.totalRecords = data.totalRecords;
    });
  }

  openDetails(stock: Stock) {
    console.log(stock);
    this.selectedStock = stock;
    this.dialogRef = this.matDialog.open(this.stockHistoryTemplate,
      {
        disableClose: false,
        autoFocus: true,
        width: '1300px',
        maxHeight: '80%',
        data: stock
      });
  }


  chooseColumns(content) {
    this.editModal = this.matDialog.open(content, {
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  getDefaultProductCode(productCodes) {
    return productCodes.filter(e => e.defaultCode === true)[0];
  }

}
