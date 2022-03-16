import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../../../shared/models/product';
import {ProductMgmService} from '../../../../../shared/services/product-mgm.service';
import {TranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CategoryService} from '../../../../../shared/services/category.service';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Category} from '../../../../../shared/models/category';
import {GenericTranslationComponent} from '../../../generic-translation/generic-translation.component';
import {CustomSnackBarComponent} from '../../../../../shared/compoenent/custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'app-filter-coupon-product',
  templateUrl: './filter-coupon-product.component.html',
  styleUrls: ['./filter-coupon-product.component.scss']
})
export class FilterCouponProductComponent implements OnInit {


  products: Product[];
  columns_1 = [
    'PRODUCT_FORM.UPDATED_AT',
    'PRODUCT_FORM.EAN_CODE',
    'PRODUCT_FORM.CODE',
  ];

  columns_2 = [
    'PRODUCT_FORM.DESCRIPTION',
    'PRODUCT_FORM.PRICE',
    'PRODUCT_FORM.STOCK'
  ];

  catPage = 1;
  categories: Category[] = [];

  subCategories: Category[] = [];

  subSubCategories: Category[] = [];
  subSubCatSearchFormControl = new FormControl(null);
  subSubCatPage = 1;

  categoryId = null;
  public page = 1;
  public totalRecords: number;
  public pageSize = 10;

  altProdCodes: any[] = [];
  orderType = 'DESC';
  sort: { attribute: string; direction: string };
  showFilter = false;
  searchText: string = '';

  constructor( public dialogRef: MatDialogRef<FilterCouponProductComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private productService: ProductMgmService,
               private  translationLoader: TranslationLoaderService, private snackBar: MatSnackBar,
              private categoryService: CategoryService, public matDialog: MatDialog, private fb: FormBuilder) {
    this.products = this.data.products;

  }

  ngOnInit() {
    this.getCategories();


  }



  getCategories() {
    this.categoryService.getLazyCategoryList({
      page: this.catPage,
      pageSize: 10,
      parentId: -1,
      createdAt: '',
      updatedAt: '',
      status: 1
    }).subscribe(d => {
      this.categories = [...this.categories, ...d.data];
      this.catPage++;
    });
  }




  filterProducts(sort?) {
    this.page = 1;
    this.getLazyProduct(sort);
  }

  getLazyProduct(sort?, snackBarConf?) {
    return this.productService.getLazyProductList({
      page: this.page,
      pageSize: this.pageSize,
      textSearch: '',
      categoryId: this.categoryId,
      sort
    }).subscribe(data => {
      this.products = data.data;
      this.totalRecords = data.totalRecords;
      if (snackBarConf) {
        this.showSnackBar(snackBarConf);
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

  showCodes($event, product: Product, codesTemlpate) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.altProdCodes = product.productCodes;
    const dialogRefTranslation = this.matDialog.open(codesTemlpate, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
    });
    dialogRefTranslation.afterClosed().subscribe(d => {
      this.altProdCodes = [];
    });
  }

  setDescriptionByLang(list: any[]) {
    return list.filter(e => e.langCode === this.translationLoader.getActiveLanguage())[0];
  }

  showDescription($event, product: Product) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const descriptionControl = new FormArray([]);
    product.transInfo.forEach(e => {
      descriptionControl.push(this.fb.group({
        description: new FormControl(e.description),
        langCode: new FormControl(e.langCode),
        langCodeId: new FormControl(e.langCodeId)
      }));
    });
    const dialogRefTranslation = this.matDialog.open(GenericTranslationComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: false, editClicked: false, list: descriptionControl.value,
      }
    });
    dialogRefTranslation.afterClosed().subscribe(d => {
    });
  }


  sortRows(c: string) {
    const sort = c.substr(13);
    if (this.orderType === 'ASC') {
      this.orderType = 'DESC';
    } else {
      this.orderType = 'ASC';
    }
    switch (sort) {
      case 'ID':
        this.filterProducts({
          attribute: 'id',
          direction: this.orderType
        });
        this.sort = {
          attribute: 'id',
          direction: this.orderType
        };
        break;
      case 'BAR_CODE':
        this.filterProducts({
          attribute: 'barCode',
          direction: this.orderType
        });
        break;
      case 'DESCRIPTION':
        this.filterProducts({
          attribute: 'description',
          direction: this.orderType
        });
        break;
      case 'PRICE':
        this.filterProducts({
          attribute: 'price',
          direction: this.orderType
        });
        break;
    }
  }



}
