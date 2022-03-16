import {Component, Injector, OnInit} from '@angular/core';
import {ProductLazyRequest, ProductMgmService} from "../../../../../../shared/services/product-mgm.service";
import {SearchResponse} from "../../../../../../shared/dto/search-response";
import {Product} from "../../../../../../shared/models/product";
import {FormControl, FormGroup} from "@angular/forms";
import {Brand} from "../../../../../../shared/models/brand";
import {Category} from "../../../../../../shared/models/category";
import {SaleAppService} from "../../../../../../shared/services/sale-app/sale-app.service";
import {GoogleMerchantService} from "../../../../../../shared/services/sale-app/google-merchant.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {BrandService} from "../../../../../../shared/services/brand.service";
import {CategoryService} from "../../../../../../shared/services/category.service";
import {ManufacturerService} from "../../../../../../shared/services/manufacturer.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {debounceTime} from "rxjs/operators";
import {EbayService} from "../../../../../../shared/services/sale-app/ebay.service";
import {EbayInventoryItem} from "../../../../../../shared/models/sale-app/ebay/ebay-inventory-item";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.DESCRIPTION',
    'DATA_TABLE.PRICE',
    'DATA_TABLE.STOCK',
    'DATA_TABLE.ACTIVE',
    'DATA_TABLE.SPECIAL',
    'DATA_TABLE.UPDATED_AT',
  ];

  dialogRef: any;
  data: any;

  loading = true;
  request: ProductLazyRequest;
  responseProduct: SearchResponse<Product>;

  filterForm: FormGroup;
  brandList: Brand[] = [];
  brandSearchFormControl = new FormControl(null);
  brandPage = 1;
  showFilter = false;

  categories: Category[] = [];
  catPage = 1;
  subCategories: Category[] = [];
  subCatPage = 1;
  subSubCategories: Category[] = [];
  subSubCatPage = 1;
  manufacturersList: any[] = [];
  manufacturersPage = 1;

  allProductSelected: boolean = false;
  productToAddList: boolean[] = [];
  productSelectedToAddInLoading: boolean = false;
  productFilteredToAddInLoading: boolean = false;

  constructor(
    private injector: Injector,
    private productService: ProductMgmService,
    private saleAppService: SaleAppService,
    private ebayService: EbayService,
    private googleMerchantService: GoogleMerchantService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
  ) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.data = this.injector.get(MAT_DIALOG_DATA, null);
    this.initFilterForm();
  }

  ngOnInit() {
    this.getCategories();
    this.getBrands();
    this.getManufacturers();
    this.initRequest();
    this.getLazyProduct();
  }


  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      cat1: new FormControl(null),
      cat2: new FormControl(null),
      cat3: new FormControl(null),
      brandId: new FormControl(null),
      manufacturer: new FormControl(null),
      inPromo: new FormControl(false),
      inEvidenza: new FormControl(false),
      disabled: new FormControl(false),
      stockZero: new FormControl(false),
      priceZero: new FormControl(false),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.textSearch = v;
        this.getLazyProduct();
      });

    this.filterForm.get('cat1').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.categoryId = v;
        this.getLazyProduct();
        if (v) {
          this.getSubCategories();
        }
        else {
          this.subCategories = [];
        }
        this.filterForm.get('cat2').setValue(null);
      });

    this.filterForm.get('cat2').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        if (v) {
          this.getSubSubCategories();
          this.request.page = 1;
          this.request.categoryId = v;
          this.getLazyProduct();
        }
        else {
          this.subSubCategories = [];
        }
        this.filterForm.get('cat3').setValue(null);
      });

    this.filterForm.get('cat3').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        if (v) {
          this.request.page = 1;
          this.request.categoryId = v;
          this.getLazyProduct();
        }
      });

    this.filterForm.get('brandId').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.brandId = v;
        this.getLazyProduct();
      });

    this.filterForm.get('manufacturer').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.manufacturerId = v;
        this.getLazyProduct();
      });

    this.filterForm.get('inPromo').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.inPromo = v;
        this.getLazyProduct();
      });

    this.filterForm.get('inEvidenza').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.inEvidenza = v;
        this.getLazyProduct();
      });

    this.filterForm.get('disabled').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.disabled = v;
        this.getLazyProduct();
      });

    this.filterForm.get('priceZero').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.priceZero = v;
        this.getLazyProduct();
      });

    this.filterForm.get('stockZero').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.stockZero = v;
        this.getLazyProduct();
      });
  }

  getBrands() {
    this.brandService.getLazyBrands({page: this.brandPage, pageSize: 10}).subscribe(d => {
      this.brandList = [...this.brandList, ...d.data];
      this.brandPage++;
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
      parentId: this.filterForm.get('cat1').value,
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
      parentId: this.filterForm.get('cat2').value,
      createdAt: '',
      updatedAt: '',
      status: 1
    }).subscribe(d => {
      this.subSubCategories = [...this.subSubCategories, ...d.data];
      this.subSubCatPage++;
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
    this.initFilterForm();
    this.initRequest();
    this.getLazyProduct();
  }

  initRequest() {
    this.request = new ProductLazyRequest();
    this.request.page = 1;
    this.request.pageSize = 10;
  }

  getLazyProduct() {
    this.loading = true;
    return this.productService.getLazyProductList(this.request).subscribe(
      (data) => {
        this.responseProduct = data;
        this.productToAddList = new Array(this.responseProduct.data.length);
        this.allProductSelected = false;
        this.loading = false;
      },
      () => {this.loading = false;}
    );
  }

  pageChange($event) {
    this.request.page = $event;
    this.getLazyProduct();
  }

  close() {
    this.dialogRef.close(null);
  }

  /***************** Ebay  functions *********************/

  addProductToEbay(product: Product) {
    product.inLoading = true;
    const ebayItem = this.ebayService.mapToEbayInventoryItem(product, false);
    this.ebayService.addProduct(this.data.saleApp.ebayUuid, product.id.toString(), 'en-US', ebayItem)
      .subscribe(() => {
        product.inLoading = false;
        this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000});
      }, () => {
        product.inLoading = false;
        this.snackBar.open(this.translate.instant('DIALOG.CANNOT_ADD'), 'Ok', {duration: 5000});
      });
  }

  addSelectedProductToEbay() {
    this.productSelectedToAddInLoading = true;
    const items: EbayInventoryItem[]  = [];
    for (let i =0; i<this.productToAddList.length; i++) {
      if (this.productToAddList[i] === true) {
        items.push(this.ebayService.mapToEbayInventoryItem(this.responseProduct.data[i], true));
      }
    }
    console.log('items = ', items);
    this.ebayService.addSelectedProductList(this.data.saleApp.ebayUuid, items)
      .subscribe((response) => {
        this.productSelectedToAddInLoading = false;
        this.productToAddList = new Array(this.productToAddList.length);
        this.allProductSelected = false;
        this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000});
      }, (error) => {
        this.productSelectedToAddInLoading = false;
        this.snackBar.open(this.translate.instant('DIALOG.CANNOT_ADD'), 'Ok', {duration: 5000});
      });
  }

  addFilteredProductToEbay() {
    console.log('start add filtering products !!!');
    this.productFilteredToAddInLoading = true;
    this.ebayService.addFilteredProductList(this.request).
    subscribe((response) => {
      console.log('response ', response);
      this.productFilteredToAddInLoading = false;
      this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000});
      console.log('response add filtered = ', response);
    }, (error) => {
      console.log("error = ", error);
      this.snackBar.open(this.translate.instant('DIALOG.CANNOT_ADD'), 'Ok', {duration: 5000});
      this.productFilteredToAddInLoading = false;
    });
  }

  isThereSelectedProductsToAdd(): boolean {
    for (const r of this.productToAddList) {
      if (r === true) {
        return true;
      }
    }
    return false;
  }

  selectPageProducts($event) {
    for (let i =0; i<this.productToAddList.length; i++) {
      this.productToAddList[i] = $event.checked;
    }
  }
}
