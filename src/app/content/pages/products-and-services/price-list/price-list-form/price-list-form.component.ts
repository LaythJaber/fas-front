import { PriceListService } from '../../../../../shared/services/price-list.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { delay, takeUntil, mergeMap } from 'rxjs/operators';
import { Product } from 'src/app/shared/models/product';
import { ProductMgmService } from 'src/app/shared/services/product-mgm.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { PriceList } from 'src/app/shared/models/price-list';

@Component({
  selector: 'app-price-list-form',
  templateUrl: './price-list-form.component.html',
  styleUrls: ['./price-list-form.component.scss']
})
export class PriceListFormComponent implements OnInit {

  priceForm: FormGroup;
  discountFormulaControl = new FormControl();
  submitted = false;
  productsList: Product[] = [];
  productsPage = 1;
  unsubscribe$ = new Subject();
  productSearch$ = new Subject<string>();
  loading = false;
  loadProd = false;
  searchValue: string;
  rowTypes = [];
  searchProducts$ = new Subject<string>();
  finalProductSearch: string = null;
  priceList: PriceList;

  constructor(
    public dialogRef: MatDialogRef<PriceListFormComponent>,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private productService: ProductMgmService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private priceListService: PriceListService
  ) {
  }


  ngOnInit(): void {

    this.priceForm = new FormGroup({
      id: new FormControl(),
      productId: new FormControl(null, Validators.required),
      productCode: new FormControl(),
      productDescription: new FormControl(),

      priceList1Value: new FormControl(null, Validators.required),
      priceList2Value: new FormControl(null, Validators.required),
      priceList3Value: new FormControl(null, Validators.required),
      priceList4Value: new FormControl(null, Validators.required),

      priceList1FormulaField: new FormControl(null, [Validators.pattern(/^([0-9])+(\+[0-9]+){0,2}$/)]),
      priceList2FormulaField: new FormControl(null, [Validators.pattern(/^([0-9])+(\+[0-9]+){0,2}$/)]),
      priceList3FormulaField: new FormControl(null, [Validators.pattern(/^([0-9])+(\+[0-9]+){0,2}$/)]),
      priceList4FormulaField: new FormControl(null, [Validators.pattern(/^([0-9])+(\+[0-9]+){0,2}$/)]),

    });

    this.searchProduct();
    if (this.data.editMode) {
      this.productService.getById(this.data.priceList.productId).subscribe(r => {
        if (this.productsList.filter(u => u.id === this.data.priceList.productId).length === 0) {
          this.productsList = [...this.productsList, r];
        }
      });
      this.priceForm.patchValue(this.data.priceList);
      this.priceForm.get('productId').disable();
    }

    this.priceForm.get('productId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      if (c) {
        this.productService.getById(c).subscribe(r => {
          const product = r;
          // tslint:disable-next-line: max-line-length
          if (!this.data.editMode && this.finalProductSearch !== null /*&& !product.description.toLowerCase().includes(this.finalProductSearch.toLowerCase())*/) {
            this.sweetAlertService.notification(this.translate.instant('MOVEMENT_FORM.PRODUCT_SELECTED_VIA_CODES')).then(e => {
            });
            this.finalProductSearch = null;
          }
          this.priceForm.get('productCode').setValue(this.getDefaultProductCode(product).code);
          this.priceForm.get('productDescription').setValue(product.description);

        });
      }
    });
  }




  save() {
    this.submitted = true;
    if (!this.priceForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (this.priceForm.valid) {
      this.priceListService.updatePrice(this.priceForm.getRawValue()).subscribe(r => {
        this.dialogRef.close(true);
      });
    }
  }

  //PRODUCTS

  loadProducts(request) {
    this.loadProd = true;
    this.productService.searchIncludingDescriptionsAndCodes(request).subscribe(d => {
      this.productsList = [...this.productsList, ...d.data];
      this.productsList.forEach(u => u.disabled = u.existsInPriceList);
      this.productsPage++;
      this.loadProd = false;
    });
  }


  clear() {
    this.reset();
    this.loadProducts({ page: this.productsPage, pageSize: 10 });
  }

  reset() {
    this.productsList = [];
    this.productsPage = 1;
    this.searchValue = null;
  }

  open() {
    this.reset();
    this.loadProducts({ page: this.productsPage, pageSize: 10 });
  }


  searchProduct() {
    this.searchProducts$
      .pipe(takeUntil(this.unsubscribe$))
     // .pipe(mergeMap(event => of(event).pipe(delay(500), takeUntil(this.unsubscribe$))))
      .subscribe(s => {
         if (s !== this.searchValue) {
          this.productsList = [];
          this.productsPage = 1;
          this.searchValue = s;
          this.finalProductSearch = s;
          console.log(s);
        }
        this.loadProducts({ page: this.productsPage, pageSize: 10, textSearch: this.searchValue });
      });
  }

  getDefaultProductCode(product: Product) {
    return product.productCodes.filter(e => e.defaultCode === true)[0];
  }

}
