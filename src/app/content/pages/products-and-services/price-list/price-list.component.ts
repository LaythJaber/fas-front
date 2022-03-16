import { TranslateService } from '@ngx-translate/core';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { PriceListService } from '../../../../shared/services/price-list.service';
import { PriceList } from 'src/app/shared/models/price-list';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { PriceListFormComponent } from './price-list-form/price-list-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/shared/models/product';
import { CustomSnackBarComponent } from 'src/app/shared/compoenent/custom-snack-bar/custom-snack-bar.component';
import { PriceListEnum } from 'src/app/shared/enum/price-list-enum.enum';
import { StartingPriceCriteria } from 'src/app/shared/enum/starting-price-criteria.enum';
import { RechargeDischargeCriteria } from 'src/app/shared/enum/recharge-discharge-criteria.enum';
import { Subject } from 'rxjs';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {
  criteriaForm: FormGroup;
  public page = 1;
  public totalRecords: number;
  public pageSize;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  rows: PriceList[] = [];
  priceCriterias: any[] = [];
  startingPriceCriterias: any[] = [];
  rechargeDischargeCriterias: any[] = [];
  searchFormControl = new FormControl(null);
  textSearch = null;
  dialogReference: any;
  loading = false;
  unsubscribe$ = new Subject();
  columns = ['PRODUCT_FORM.CODE',
    'PRODUCT_FORM.DESCRIPTION',
    'PRODUCT_FORM.PriceListValue1',
    'PRODUCT_FORM.PriceList1FormulaField',
    'PRODUCT_FORM.PriceListValue2',
    'PRODUCT_FORM.PriceList2FormulaField',
    'PRODUCT_FORM.PriceListValue3',
    'PRODUCT_FORM.PriceList3FormulaField',
    'PRODUCT_FORM.PriceListValue4',
    'PRODUCT_FORM.PriceList4FormulaField'];


  constructor(
    private localStorageService: LocalStorageService,
    private matDialog: MatDialog,
    private breadcrumbService: BreadcrumbService,
    private priceListService: PriceListService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.translatePriceCriterias();
    this.translateStartingPriceCriterias();
    this.translateRechargeDischargeCriterias();

    this.sendBreadCrumb();
    this.getLazyPriceList({ page: this.page, pageSize: this.pageSize });
    this.searchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
      this.textSearch = s;
      this.page = 1;
      this.getLazyPriceList({ page: 1, pageSize: this.pageSize, textSearch: s });
    });

    this.criteriaForm = new FormGroup({
      id: new FormControl(),
      priceCriteria: new FormControl(null, Validators.required),
      startingPriceCriteria: new FormControl(null, Validators.required),
      rechargeDecargeCriteria: new FormControl(null, Validators.required),
      customCriteria: new FormControl(null),
      recharge: new FormControl(null, Validators.required),  //Custom recharge percentage
      amount: new FormControl(null, Validators.required),  //Custom recharge amount
      formula: new FormControl(null, [Validators.pattern(/^([0-9])+(\+[0-9]+){0,2}$/)])  //Propose descharge formula
    });

    this.criteriaForm.get('rechargeDecargeCriteria').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      if (c === 'CUSTOM_RECHARGE_PERCENTAGE' || c === 'CUSTOM_DESCHARGE_PERCENTALE') {
        this.criteriaForm.get('recharge').setValidators(Validators.required);
        this.criteriaForm.get('recharge').updateValueAndValidity();
      }
      if (c !== 'CUSTOM_RECHARGE_PERCENTAGE' && c !== 'CUSTOM_DESCHARGE_PERCENTALE') {
        this.criteriaForm.get('recharge').setValidators(null);
        this.criteriaForm.get('recharge').updateValueAndValidity();
      }
      if (c === 'CUSTOM_RECHARGE_AMOUNT' || c === 'CUSTOM_DESCHARGE_AMOUNT') {
        this.criteriaForm.get('amount').setValidators(Validators.required);
        this.criteriaForm.get('amount').updateValueAndValidity();
      }
      if (c !== 'CUSTOM_RECHARGE_AMOUNT' && c !== 'CUSTOM_DESCHARGE_AMOUNT') {
        this.criteriaForm.get('amount').setValidators(null);
        this.criteriaForm.get('amount').updateValueAndValidity();
      }
      if (c === 'PROPOSE_DESCHARGE_FORMULA') {
        this.criteriaForm.get('formula').setValidators(Validators.required);
        this.criteriaForm.get('formula').updateValueAndValidity();
      } else {
        this.criteriaForm.get('formula').setValidators(null);
        this.criteriaForm.get('formula').updateValueAndValidity();
      }

    });
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }
  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['PRODUCT_AND_SERVICES', 'PRICE_LIST']);
  }

  getLazyPriceList(request) {
    this.loading = true;
    return this.priceListService.searchPriceList(request).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
      this.totalRecords = data.totalRecords;
      /*  if (snackBarConf) {
          this.showSnackBar(snackBarConf);
        }*/
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyPriceList({ page, pageSize: this.pageSize, textSearch: this.textSearch });
  }


  add() {
    const dialogRef = this.matDialog.open(PriceListFormComponent, {
      width: '900px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: false,
      }
    });
    dialogRef.afterClosed().subscribe((d) => {
      if (d) {
        this.getLazyPriceList({ page: 1, pageSize: this.pageSize, textSearch: this.textSearch });
      }
    });
  }

  edit($event, priceList: PriceList) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(PriceListFormComponent, {
      width: '900px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: true,
        priceList: priceList,
      }
    });
    dialogRef.afterClosed().subscribe((d) => {
      if (d) {
        this.getLazyPriceList({ page: 1, pageSize: this.pageSize, textSearch: this.textSearch });
      }
    });
  }

  delete($event, priceList: PriceList) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE'))
      .then(res => {
        if (res.value) {
          this.priceListService.delete(priceList.id).subscribe(r => {
            this.showSnackBar({
              text: ``,
              actionIcon: 'delete',
              actionMsg: this.translate.instant('DIALOG.DELETE_SUCCESS')
            });
            this.getLazyPriceList({ page: this.page, pageSize: this.pageSize, textSearch: this.textSearch });
          }, err => {
            if (err.status === 500) {
              this.showSnackBar({
                text: ``,
                actionIcon: 'failed',
                actionMsg: this.translate.instant('DIALOG.CANNOT_DELETE')
              });
            }
          });
        }
      });
  }

  showSnackBar(data: any) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data,
      duration: 5000,
      panelClass: 'white-snackbar'
    });
  }

  getDefaultProductCode(product: Product) {
    return product.productCodes.filter(e => e.defaultCode === true)[0];
  }

  open(content) {
    this.criteriaForm.get('id').setValue(localStorage.getItem('id') !== 'null' ? localStorage.getItem('id') : null);
    this.criteriaForm.get('priceCriteria').setValue(localStorage.getItem('priceCriteria') !== 'null' ? localStorage.getItem('priceCriteria') : null);
    this.criteriaForm.get('startingPriceCriteria').setValue(localStorage.getItem('startingPriceCriteria') !== 'null' ? localStorage.getItem('startingPriceCriteria') : null);
    this.criteriaForm.get('rechargeDecargeCriteria').setValue(localStorage.getItem('rechargeDecargeCriteria') !== 'null' ? localStorage.getItem('rechargeDecargeCriteria') : null);
    this.criteriaForm.get('customCriteria').setValue(localStorage.getItem('customCriteria') !== 'null' ? localStorage.getItem('customCriteria') : null);
    this.criteriaForm.get('recharge').setValue(localStorage.getItem('recharge') !== 'null' ? localStorage.getItem('recharge') : null);
    this.criteriaForm.get('amount').setValue(localStorage.getItem('amount') !== 'null' ? localStorage.getItem('amount') : null);
    this.criteriaForm.get('formula').setValue(localStorage.getItem('formula') !== 'null' ? localStorage.getItem('formula') : null);
    this.dialogReference = this.matDialog.open(content, {
      width: '900px',
      autoFocus: true,
      disableClose: true,
    });
    this.dialogReference.afterClosed().subscribe((d) => {
      if (d) {

      }
    });
  }

  generate() {
    if (!this.criteriaForm.valid) {
      console.log(this.criteriaForm);
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    localStorage.setItem('id', this.criteriaForm.get('id').value);
    localStorage.setItem('priceCriteria', this.criteriaForm.get('priceCriteria').value);
    localStorage.setItem('startingPriceCriteria', this.criteriaForm.get('startingPriceCriteria').value);
    localStorage.setItem('rechargeDecargeCriteria', this.criteriaForm.get('rechargeDecargeCriteria').value);
    localStorage.setItem('customCriteria', this.criteriaForm.get('customCriteria').value);
    localStorage.setItem('recharge', this.criteriaForm.get('recharge').value);
    localStorage.setItem('amount', this.criteriaForm.get('amount').value);
    localStorage.setItem('formula', this.criteriaForm.get('formula').value);
    this.priceListService.applyCriteria(this.criteriaForm.getRawValue()).subscribe(r => {
      this.getLazyPriceList({ page: 1, pageSize: this.pageSize, textSearch: this.textSearch });
    });
    this.dialogReference.close();
  }

  translatePriceCriterias() {
    this.priceCriterias = [
      { description: PriceListEnum.PRICELIST1, id: PriceListEnum.PRICELIST1 },
      { description: PriceListEnum.PRICELIST2, id: PriceListEnum.PRICELIST2 },
      { description: PriceListEnum.PRICELIST3, id: PriceListEnum.PRICELIST3 },
      { description: PriceListEnum.PRICELIST4, id: PriceListEnum.PRICELIST4 }
    ];
  }

  translateStartingPriceCriterias() {
    this.startingPriceCriterias = [
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.PRICELIST1), id: StartingPriceCriteria.PRICELIST1 },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.PRICELIST2), id: StartingPriceCriteria.PRICELIST2 },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.PRICELIST3), id: StartingPriceCriteria.PRICELIST3 },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.PRICELIST4), id: StartingPriceCriteria.PRICELIST4 },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.PRICE), id: StartingPriceCriteria.PRICE },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.PRICE_OF_SALE), id: StartingPriceCriteria.PRICE_OF_SALE },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.VALUE_PRICE_LAST_SALE), id: StartingPriceCriteria.VALUE_PRICE_LAST_SALE },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.VALUE_PRICE_AVERAGE_SALE), id: StartingPriceCriteria.VALUE_PRICE_AVERAGE_SALE },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.VALUE_PRICE_AVERAGE_SALE_MOV), id: StartingPriceCriteria.VALUE_PRICE_AVERAGE_SALE_MOV },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.VALUE_PRICE_LAST_PURCH), id: StartingPriceCriteria.VALUE_PRICE_LAST_PURCH },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.VALUE_PRICE_AVERAGE_PURCH), id: StartingPriceCriteria.VALUE_PRICE_AVERAGE_PURCH },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.VALUE_PRICE_LOW_PURCH), id: StartingPriceCriteria.VALUE_PRICE_LOW_PURCH },
      { description: this.translate.instant('PRODUCT_FORM.' + StartingPriceCriteria.VALUE_PRICE_MAX_PURCH), id: StartingPriceCriteria.VALUE_PRICE_MAX_PURCH }
    ];
  }


  translateRechargeDischargeCriterias() {
    this.rechargeDischargeCriterias = [
      { description: this.translate.instant('PRODUCT_FORM.' + RechargeDischargeCriteria.NOTHING), id: RechargeDischargeCriteria.NOTHING },
      { description: this.translate.instant('PRODUCT_FORM.' + RechargeDischargeCriteria.RECHARGE), id: RechargeDischargeCriteria.RECHARGE },
      { description: this.translate.instant('PRODUCT_FORM.' + RechargeDischargeCriteria.RECHARGE_SALE), id: RechargeDischargeCriteria.RECHARGE_SALE },
      { description: this.translate.instant('PRODUCT_FORM.' + RechargeDischargeCriteria.CUSTOM_RECHARGE_PERCENTAGE), id: RechargeDischargeCriteria.CUSTOM_RECHARGE_PERCENTAGE },
      { description: this.translate.instant('PRODUCT_FORM.' + RechargeDischargeCriteria.CUSTOM_RECHARGE_AMOUNT), id: RechargeDischargeCriteria.CUSTOM_RECHARGE_AMOUNT },
      { description: this.translate.instant('PRODUCT_FORM.' + RechargeDischargeCriteria.CUSTOM_DESCHARGE_PERCENTALE), id: RechargeDischargeCriteria.CUSTOM_DESCHARGE_PERCENTALE },
      { description: this.translate.instant('PRODUCT_FORM.' + RechargeDischargeCriteria.CUSTOM_DESCHARGE_AMOUNT), id: RechargeDischargeCriteria.CUSTOM_DESCHARGE_AMOUNT },
      { description: this.translate.instant('PRODUCT_FORM.' + RechargeDischargeCriteria.PROPOSE_DESCHARGE_FORMULA), id: RechargeDischargeCriteria.PROPOSE_DESCHARGE_FORMULA }
    ];
  }

}
