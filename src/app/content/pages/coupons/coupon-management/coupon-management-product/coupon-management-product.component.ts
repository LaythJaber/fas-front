import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductLazyRequest, ProductMgmService} from '../../../../../shared/services/product-mgm.service';
import {Product} from '../../../../../shared/models/product';
import {TranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {CustomSnackBarComponent} from '../../../../../shared/compoenent/custom-snack-bar/custom-snack-bar.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CategoryService} from '../../../../../shared/services/category.service';
import {Category} from '../../../../../shared/models/category';
import {BrandService} from '../../../../../shared/services/brand.service';
import {ManufacturerService} from '../../../../../shared/services/manufacturer.service';
import {Brand} from '../../../../../shared/models/brand';
import {GenericTranslationComponent} from '../../../generic-translation/generic-translation.component';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';
import {Client} from '../../../../../shared/models/client';
import {FilterCouponClientsComponent} from '../filter-coupon-clients/filter-coupon-clients.component';
import {FilterCouponProductComponent} from '../filter-coupon-product/filter-coupon-product.component';

@Component({
  selector: 'app-coupon-management-product',
  templateUrl: './coupon-management-product.component.html',
  styleUrls: ['./coupon-management-product.component.scss']
})
export class CouponManagementProductComponent implements OnInit {

  @Input() products: Product[] = [];

  @Output() newItemEventPdt = new EventEmitter<Product[]>();
  @Input() editMode ;
  @Input() editClicked ;
  searchFormControl = new FormControl(null);

  public page = 1;
  public totalRecords: number;
  public pageSize = 10;
  loading = true;
  categoryId = null;
  altProdCodes: any[] = [];
  orderType = 'DESC';
  sort: { attribute: string; direction: string };

  brandList: Brand[] = [];
  brandSearchFormControl = new FormControl(null);
  brandPage = 1;

  inEvidenzaFormControl = new FormControl(false);
  disabledFormControl = new FormControl(false);
  stockZeroFormControl = new FormControl(false);
  priceZeroFormControl = new FormControl(false);
  inPromoFormControl = new FormControl(false);
  rows: Product[] = [];
  manufacturersList: any[] = [];
  manufactSearchFormControl = new FormControl(null);
  manufacturersPage = 1;

  catSearchFormControl = new FormControl(null);

  catPage = 1;
  categories: Category[] = [];

  subCategories: Category[] = [];
  subCatSearchFormControl = new FormControl(null);
  subCatPage = 1;

  subSubCategories: Category[] = [];
  subSubCatSearchFormControl = new FormControl(null);
  subSubCatPage = 1;

  showFilter = false;

  @Input()
  selectedProducts: Product[]  = [];

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


  constructor(private productService: ProductMgmService, public  translationLoader: TranslationLoaderService, public snackBar: MatSnackBar,
      private categoryService: CategoryService, private brandService: BrandService, private manufacturerService: ManufacturerService,
       private matDialog: MatDialog, private fb: FormBuilder,  private translate: TranslateService,  private sweetAlertService: SweetAlertService) {
  }


   ngOnInit() {
     this.getCategories();
     this.getBrands();
     this.getManufacturers();
     this.filterProducts();
     this.searchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.filterProducts();
     });
     this.catSearchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.categoryId = s;
       this.filterProducts();
       this.subCategories = [];
       if (s) {
         this.getSubCategories();
       }
     });
     this.inEvidenzaFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.filterProducts();
     });
     this.brandSearchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.filterProducts();
     });
     this.disabledFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.filterProducts();
     });
     this.stockZeroFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.filterProducts();
     });
     this.priceZeroFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.filterProducts();
     });
     this.inPromoFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.filterProducts();
     });
     this.manufactSearchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
       this.filterProducts();
     });
   }

  filterProducts(sort?) {
    this.page = 1;
    this.getLazyProduct(sort);
  }

  getLazyProduct(sort?, snackBarConf?) {
     this.loading = true;
    return this.productService.getLazyProductList({
      page: this.page,
      pageSize: this.pageSize,
      textSearch: this.searchFormControl.value,
      categoryId: this.categoryId,
      brandId: this.brandSearchFormControl.value,
      inEvidenza: this.inEvidenzaFormControl.value,
      disabled: this.disabledFormControl.value,
      stockZero: this.stockZeroFormControl.value,
      priceZero: this.priceZeroFormControl.value,
      inPromo: this.inPromoFormControl.value,
      manufacturerId: this.manufactSearchFormControl.value,
      sort
    }).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
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

  getSubCategories() {
    this.categoryService.getLazyCategoryList({
      page: this.subCatPage,
      pageSize: 10,
      parentId: this.catSearchFormControl.value,
      createdAt: '',
      updatedAt: '',
      status: 1
    }).subscribe(d => {
      this.subCategories = [...this.subCategories, ...d.data];
      this.subCatPage++;
    });
  }

  getSubSubCategories() {
    this.categoryService.getLazyCategoryList({
      page: this.subSubCatPage,
      pageSize: 10,
      parentId: this.subCatSearchFormControl.value,
      createdAt: '',
      updatedAt: '',
      status: 1
    }).subscribe(d => {
      this.subSubCategories = [...this.subSubCategories, ...d.data];
      this.subSubCatPage++;
    });
  }

  getBrands() {
    this.brandService.getLazyBrands({page: this.brandPage, pageSize: 10}).subscribe(d => {
      this.brandList = [...this.brandList, ...d.data];
      this.brandPage++;
    });
  }

  getManufacturers() {
    this.manufacturerService.getLazyManufacturers({page: this.manufacturersPage, pageSize: 10}).subscribe(d => {
      this.manufacturersList = [...this.manufacturersList, ...d.data];
      this.manufacturersPage++;
    });
  }
  resetFilter() {
    this.subCatSearchFormControl.setValue(null, {emitEvent: false});
    this.subSubCatSearchFormControl.setValue(null, {emitEvent: false});
    this.brandSearchFormControl.setValue(null, {emitEvent: false});
    this.inPromoFormControl.setValue(false, {emitEvent: false});
    this.priceZeroFormControl.setValue(false, {emitEvent: false});
    this.stockZeroFormControl.setValue(false, {emitEvent: false});
    this.filterProducts();
  }


  showHideFilter() {
    this.showFilter = !this.showFilter;
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


  changeActive($event, product) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    let msg = '';
    if (product.activeDetailSale) {
      msg = this.translate.instant('DIALOG.YOU_WANT_TO_HIDE');
    } else {
      msg = this.translate.instant('DIALOG.YOU_WANT_TO_SHOW');
    }
    this.sweetAlertService.warning(this.translate.instant(msg + ' ' + this.setDescriptionByLang(product.transInfo).description))
      .then(res => {
        if (res.value) {
          this.productService.editProductStatus(product.id).subscribe(r => {
            this.filterProducts();
          });
        }
      });
  }

  changeInEvidenza($event, product: Product) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.productService.changeInEvidenzaState(product.id).subscribe(r => {
      product.inEvidenza = !product.inEvidenza;
    });
  }


  pageChange(page: number) {
    this.page = page;
    this.getLazyProduct();
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


  addToProduct(values: any, product: Product) {
    if (values.checked) {
      this.selectedProducts = [...this.selectedProducts, product];
    } else {
      const objIndex = this.selectedProducts.findIndex(obj => obj.id  === product.id);
      this.selectedProducts.splice(objIndex, 1 );
      this.selectedProducts = [...this.selectedProducts];
    }
    this.newItemEventPdt.emit(this.selectedProducts);
  }

  isChecked(product: Product) {
    return this.selectedProducts.findIndex(l => l.id === product.id) >= 0 ? true : false;
  }


  openFilterProducts() {

    const dialogRef = this.matDialog.open(FilterCouponProductComponent, {
      width: '70%',
      autoFocus: true,
      disableClose: false,
      data: {products: this.selectedProducts}
    });
    dialogRef.afterClosed().subscribe((response: any) => {

    });
  }


}
