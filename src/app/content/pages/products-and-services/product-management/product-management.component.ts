import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {MatDialog, MatPaginator, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime} from 'rxjs/operators';
import {BreadcrumbService} from 'src/app/core/services/breadcrumb.service';
import {CustomSnackBarComponent} from 'src/app/shared/compoenent/custom-snack-bar/custom-snack-bar.component';
import {Product} from 'src/app/shared/models/product';
import {MessageService} from 'src/app/shared/services/message.service';
import {ProductMgmService} from 'src/app/shared/services/product-mgm.service';
import {SweetAlertService} from 'src/app/shared/services/sweet-alert.service';
import {GenericTranslationComponent} from '../../generic-translation/generic-translation.component';
import {TranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {Category} from '../../../../shared/models/category';
import {CategoryService} from '../../../../shared/services/category.service';
import {BrandService} from '../../../../shared/services/brand.service';
import {Brand} from '../../../../shared/models/brand';
import {ManufacturerService} from '../../../../shared/services/manufacturer.service';
import {LocalStorageService} from 'ngx-webstorage';
import {PurchaseRow} from '../../../../shared/models/purchase/purchase-row';
import {ProductCode} from '../../../../shared/models/product-code';
import set = Reflect.set;
import {ImportEnterpriseModel} from '../../../../shared/enum/import-enterprise-model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  altProdCodes: any[] = [];
  columns_1 = [
    'PRODUCT_FORM.UPDATED_AT',
    'PRODUCT_FORM.EAN_CODE',
    'PRODUCT_FORM.CODE',
  ];

  columns_2 = [
    'PRODUCT_FORM.DESCRIPTION',
    'PRODUCT_FORM.PRICE',
    'PRODUCT_FORM.STOCK',
    'PRODUCT_FORM.AVAILABILITY'
  ];

  public page = 1;
  public totalRecords: number;
  public pageSize = 10;
  loading = true;
  firstCall = true;
  textSearch = null;
  rows: Product[] = [];
  orderType = 'DESC';
  searchFormControl = new FormControl(null);
  inEvidenzaFormControl = new FormControl(false);
  disabledFormControl = new FormControl(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('productFormContainer', {read: ViewContainerRef}) productFormContainer: ViewContainerRef;
  categories: Category[] = [];
  catSearchFormControl = new FormControl(null);
  catPage = 1;

  subCategories: Category[] = [];
  subCatSearchFormControl = new FormControl(null);
  subCatPage = 1;

  subSubCategories: Category[] = [];
  subSubCatSearchFormControl = new FormControl(null);
  subSubCatPage = 1;

  brandList: Brand[] = [];
  brandSearchFormControl = new FormControl(null);
  brandPage = 1;
  categoryId = null;
  subCategoryId = null;
  subSubCategoryId = null;
  sort: { attribute: string; direction: string };

  priceZeroFormControl = new FormControl(false);
  inPromoFormControl = new FormControl(false);
  stockZeroFormControl = new FormControl(false);
  showFilter = false;

  manufacturersList: any[] = [];
  manufactSearchFormControl = new FormControl(null);
  manufacturersPage = 1;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  types: any[] = [];

  constructor(
    private translate: TranslateService,
    public snackBar: MatSnackBar,
    private productService: ProductMgmService,
    private breadcrumbService: BreadcrumbService,
    private sweetAlertService: SweetAlertService,
    public dialog: MatDialog,
    private router: Router,
    private messageService: MessageService,
    private matDialog: MatDialog,
    private fb: FormBuilder,
    private translationLoader: TranslationLoaderService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private manufacturerService: ManufacturerService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.translateTypes();
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
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
      this.subCatPage = 1;
      if (s) {
        this.getSubCategories();
      }
    });
    this.subCatSearchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
      this.subCategoryId = s;
      this.filterProducts();
      this.subSubCategories = [];
      this.subSubCatPage = 1;
      if (s) {
        this.getSubSubCategories();
      }
    });
    this.subSubCatSearchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
      this.subSubCategoryId = s;
      this.filterProducts();
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

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['PRODUCT_AND_SERVICES', 'PRODUCT']);
  }

  printTickets() {
    this.productService.getTicket().subscribe(data => {
      const downloadUrl = window.URL.createObjectURL(data.body);
      window.open(downloadUrl);
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
      categoryId: this.subSubCategoryId ? this.subSubCategoryId : (this.subCategoryId ? this.subCategoryId : this.categoryId),
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
      this.firstCall = false;
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

  pageChange(page: number) {
    this.page = page;
    this.getLazyProduct();
  }

  delete($event, el: Product): void {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + ' ' + el.description)
      .then(res => {
        if (res.value) {
          this.productService.delete(el.id).subscribe(r => {
            this.showSnackBar({
              text: `${this.setDescriptionByLang(el.transInfo).description}`,
              actionIcon: 'delete',
              actionMsg: this.translate.instant('DIALOG.DELETE_SUCCESS')
            });
            this.filterProducts();
          }, err => {
            if (err.status === 500) {
              this.showSnackBar({
                text: `${this.setDescriptionByLang(el.transInfo).description}`,
                actionIcon: 'failed',
                actionMsg: this.translate.instant('DIALOG.CANNOT_DELETE')
              });
            }
          });
        }
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

  addNewProduct() {
    this.router.navigate(['/product-mgm/product']);
  }

  sendMessage(mode: boolean, obj: any): void {
    this.messageService.sendMessage([mode, obj]);
  }

  clearMessages(): void {
    this.messageService.clearMessages();
  }

  editProduct(product: Product) {
    this.router.navigate(['/product-mgm/product', product.id]);
  }

  getDefaultProductCode(product: Product) {
    return product.productCodes.filter(e => e.defaultCode === true)[0];
  }

  setDescriptionByLang(list: any[]) {
    return list.filter(e => e.langCode === this.translationLoader.getActiveLanguage())[0];
  }

  showDescription($event, product: Product) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    console.log('******************* ', product);
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


  getProductCodeEAN8(product: Product) {
    return product.productCodes.filter(e => e.codeType === 'BARCODEEAN8')[0];
  }

  getProductCodeEAN13(product: Product) {
    return product.productCodes.filter(e => e.codeType === 'BARCODEEAN13')[0];
  }

  changeInEvidenza($event, product: Product) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.productService.changeInEvidenzaState(product.id).subscribe(r => {
      product.inEvidenza = !product.inEvidenza;
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
      status: -1
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
      status: -1
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

  showHideFilter() {
    this.showFilter = !this.showFilter;
  }

  resetFilter() {
    this.searchFormControl.setValue(null, {emitEvent: false});
    this.catSearchFormControl.setValue(null, {emitEvent: false});
    this.subCatSearchFormControl.setValue(null, {emitEvent: false});
    this.subSubCatSearchFormControl.setValue(null, {emitEvent: false});
    this.brandSearchFormControl.setValue(null, {emitEvent: false});
    this.inPromoFormControl.setValue(false, {emitEvent: false});
    this.priceZeroFormControl.setValue(false, {emitEvent: false});
    this.stockZeroFormControl.setValue(false, {emitEvent: false});
    this.filterProducts();
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.filterProducts();
  }

  setToAdd($event, product) {
    $event.stopPropagation();
    product.editCode = true;
    setTimeout(() => {
      document.getElementById('product_' + product.id).focus();
    }, 0);
  }

  saveCode(product: Product, i: number = -1) {
    const elem = document.getElementById('product_' + product.id);
    // @ts-ignore
    let ean = elem.value;
    if (ean && (ean.length === 8 || ean.length === 13)) {
      this.productService.addEanCode(product.id, ean).subscribe((r) => {
        console.log('r = ', r);
        product.editCode = false;
        if (r.status === 200) {
          product.productCodes = r.body;
        }
      }, (error) => product.editCode = false);
    } else {
      product.editCode = false;
    }
    // @ts-ignore
    elem.value = '';
  }

  passToOtherRow($event, product: Product, i: number, shift: boolean = false) {
    $event.stopPropagation();
    const index = shift ? i - 1 : i + 1;
    const rowp = this.rows[index];
    if (rowp) {
      rowp.editCode = true;
      setTimeout(() => {
        document.getElementById('product_' + rowp.id).focus();
      }, 0);
    }
    this.saveCode(product, index);
  }

  translateTypes() {
    this.types = [
      {description: this.translate.instant('Attivati'), value: false},
      {description: this.translate.instant('Disattivati'), value: true},
    ];
  }
}
