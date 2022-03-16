import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {ProductLazyRequest, ProductMgmService} from "../../services/product-mgm.service";
import {ShopCartService} from "../../services/shop-cart.service";
import {TranslationLoaderService} from "../../../core/services/translation-loader.service";
import {Product} from "../../models/product";
import {PriceService} from "../../services/price-service";
import {CartRequest} from "../../dto/cart-request";
import { Brand } from '../../models/brand';
import { Category } from '../../models/category';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { ManufacturerService } from '../../services/manufacturer.service';
import { SearchResponse } from '../../dto/search-response';

@Component({
  selector: 'app-cart-product-modal',
  templateUrl: './cart-product-modal.component.html',
  styleUrls: ['./cart-product-modal.component.scss']
})
export class CartProductModalComponent implements OnInit {

  request: ProductLazyRequest;

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
  
  columns_1 = [
    'PRODUCT_FORM.CODE',
  ];

  columns_2 = [
    'PRODUCT_FORM.DESCRIPTION',
    'PRODUCT_FORM.PRICE',
    'PRODUCT_FORM.STOCK'
  ];

  clientId: any;
  public page = 1;
  public totalRecords: number;
  public pageSize = 5;
  loading = true;
  firstCall = true;
  textSearch = null;
  rows: Product[] = [];
  searchFormControl = new FormControl(null);
  altProdCodes : any[] =[];
  dialogRefTranslation: any;
  
  constructor (
    public dialogRef: MatDialogRef<CartProductModalComponent>,
    public priceService: PriceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private productService: ProductMgmService,
    private translationLoader: TranslationLoaderService,
    private shopCartService: ShopCartService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,

  ) {
    this.clientId = this.data.clientId;
  }

  ngOnInit() {
    this.resetFilter();
    this.getCategories();
    this.getBrands();
    this.getManufacturers();
    this.getLazyProduct();
    this.searchFormControl.valueChanges.pipe(debounceTime(500)).subscribe(s => {
      this.page = 1;
      console.log(this.textSearch);
      this.textSearch = s;
      this.getLazyProduct();
    });
  }

  close() {
    this.dialogRef.close();
  }

/*  getLazyProduct(request) {
    this.loading = true;
    return this.productService.getLazyProductList(request).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
      this.firstCall = false;
      this.totalRecords = data.totalRecords;
    });
  }*/

  pageChange(page: number) {
    this.page = page;
    this.getLazyProduct();
  }

  getDefaultProductCode(product: Product) {
    return product.productCodes.filter(e => e.defaultCode === true)[0];
  }

  showCodes($event, product: Product, codesTemlpate) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.altProdCodes= product.productCodes
    this.dialogRefTranslation = this.matDialog.open(codesTemlpate, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
    });
    this.dialogRefTranslation.afterClosed().subscribe(d => {
      this.altProdCodes=[];
    });
  }

  closeTwo() {
    this.dialogRefTranslation.close();
  }

  addProduct(id: number, quantity: number, colorId: number, sizeId: number) {
    let request: CartRequest = {
      clientId: this.clientId,
      productId: id,
      quantity: quantity,
      colorId: colorId,
      sizeId: sizeId
    }
    this.shopCartService.addProductToCart(request).subscribe(result => {
      console.log(result);
    })
    this.close();
  }


  /************* */
  
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

  responseProduct: SearchResponse<Product>;
  allProductSelected = false;
  productToAddList: boolean[] = [];

/*  getLazyProduct1() {
    this.loading = true;
    return this.productService.getLazyProductList(this.request).subscribe(
      (data) => {
        this.responseProduct = data;
        this.productToAddList = new Array(this.responseProduct.data.length);
        this.allProductSelected = false;
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }*/

  getLazyProduct() {
    this.loading = true;
    return this.productService.getLazyProductList(this.request).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
      this.firstCall = false;
      this.totalRecords = data.totalRecords;
    });
  }



  initRequest() {
    this.request = new ProductLazyRequest();
    this.request.page = 1;
    this.request.pageSize = 10;
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      brandId: new FormControl(null),
      manufacturer: new FormControl(null),
      inPromo: new FormControl(false),
      inEvidenza: new FormControl(false),
      disabled: new FormControl(false),
      cat1: new FormControl(null),
      cat2: new FormControl(null),
      cat3: new FormControl(null),
      stockZero: new FormControl(false),
      priceZero: new FormControl(false),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.textSearch = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('cat1').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.categoryId = v;
        this.request.page = 1;
        this.getLazyProduct();
        if (v) {
          this.getSubCategories();
        } else {
          this.subCategories = [];
        }
        this.filterForm.get('cat2').setValue(null);
      });

    this.filterForm.get('cat2').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        if (v) {
          this.request.categoryId = v;
          this.getSubSubCategories();
          this.request.page = 1;
          this.getLazyProduct();
        } else {
          this.subSubCategories = [];
        }
        this.filterForm.get('cat3').setValue(null);
      });

    this.filterForm.get('cat3').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        if (v) {
          this.request.categoryId = v;
          this.request.page = 1;
          this.getLazyProduct();
        }
      });

    this.filterForm.get('brandId').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.brandId = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('manufacturer').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.manufacturerId = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('inPromo').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.inPromo = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('inEvidenza').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.inEvidenza = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('disabled').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.disabled = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('priceZero').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.priceZero = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('stockZero').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.stockZero = v;
        this.getLazyProduct();
      });
  }

}
