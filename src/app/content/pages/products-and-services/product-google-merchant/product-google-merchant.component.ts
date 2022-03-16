import {Component, OnInit} from '@angular/core';
import {SaleAppService} from "../../../../shared/services/sale-app/sale-app.service";
import {
  GoogleProduct, GoogleProductStatusEnum, SaleAppProductAvailability,
} from "../../../../shared/models/sale-app/google/google-product";
import {LocalTranslate} from "../../../../shared/pipes/local-translate";
import {SaleApp} from "../../../../shared/models/sale-app/sale-app";
import {MatDialog} from "@angular/material/dialog";
import {ProductListComponent} from "./components/product-list/product-list.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {ProductMgmComponent} from "./components/product-mgm/product-mgm.component";
import {GoogleMerchantService, ProductGMRequest} from "../../../../shared/services/sale-app/google-merchant.service";
import {SearchResponse} from "../../../../shared/dto/search-response";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-product-google-merchant',
  templateUrl: './product-google-merchant.component.html',
  styleUrls: ['./product-google-merchant.component.scss'],
  providers: [LocalTranslate]
})
export class ProductGoogleMerchantComponent implements OnInit {

  columns = [
    'DATA_TABLE.GM_ID',
    'DATA_TABLE.PRODUCT_ID',
    'DATA_TABLE.GTIN',
    'DATA_TABLE.TITLE',
    'DATA_TABLE.STATUS',
    'DATA_TABLE.DESCRIPTION',
    'DATA_TABLE.PRICE',
    // 'DATA_TABLE.LINK',
    'DATA_TABLE.QTE_GM',
    'DATA_TABLE.AVAILABILITY',
    'DATA_TABLE.AVAILABILITY_DATE',
    'DATA_TABLE.EXPIRY_DATE',
  ];

  filterForm: FormGroup;
  availabilityList: {id: string, label: string }[];
  statusList: {id: string, label: string }[];

  saleApp: SaleApp;
  googleProductsResponse: SearchResponse<GoogleProduct>;
  request: ProductGMRequest = new ProductGMRequest();
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];


  allProductSelected: boolean = false;
  productToDeleteList: boolean[] = [];
  productSelectedToDeleteInLoading: boolean = false;
  productAllToDeleteInLoading: boolean = false;
  productsInLoading: boolean = false;

  syncInLoading: boolean = false;

  pageSize;
  constructor(
    private saleAppService: SaleAppService,
    private googleMerchantService: GoogleMerchantService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private sweetAlertService: SweetAlertService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit() {
    this.getLists();
    this.initFilterForm();
    this.initRequest();
    this.getSaleApp();
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      status: new FormControl(null),
      availability: new FormControl(null),
      expirationDate: new FormControl(null),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.textSearch = v;
        this.getGoogleMerchantProducts();
      });

    this.filterForm.get('availability').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.availability = v;
        this.getGoogleMerchantProducts();
      });

    this.filterForm.get('status').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.status = v;
        this.getGoogleMerchantProducts();
      });

    this.filterForm.get('expirationDate').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        if (v) {
          v = v.format().substring(0,10);
        }
        this.request.page = 1;
        this.request.expirationDate = v;
        this.getGoogleMerchantProducts();
      });
  }

  getLists() {
    this.availabilityList = Object.keys(SaleAppProductAvailability)
      .map((key) => {return {id: SaleAppProductAvailability[key], label: key}});
    this.statusList =  Object.keys(GoogleProductStatusEnum)
      .map((key) => {return {id: GoogleProductStatusEnum[key], label: key}});
  }

  getSaleApp() {
    this.saleAppService.getSaleApp().subscribe((response)=> {
      this.saleApp = response;
      if (this.saleApp && this.saleApp.googleMerchantEnabled) {
        this.getGoogleMerchantProducts();
      }
      else {
        this.sweetAlertService.notification('Devi attivare Google Merchant').then(e => {});
      }
    })
  }

  initRequest() {
    this.request.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.request.page = 1;
    this.request.textSearch = '';
  }

  getGoogleMerchantProducts() {
    this.productsInLoading = true;
    this.googleMerchantService.getProductList(this.saleApp.googleMerchantUserId, this.request)
      .subscribe((response) => {
        console.log('products gm = ', response);
        this.googleProductsResponse = response;
        this.productToDeleteList = new Array(this.googleProductsResponse.data.length);
        this.allProductSelected = false;
        this.productsInLoading = false;
      }, error => {
        this.productsInLoading = false;
      });
  }

  pageChange(page: number) {
    this.request.page = page;
    this.getGoogleMerchantProducts();
  }

  showRows() {
    this.localStorageService.store('pageSize', this.request.pageSize);
    this.request.page=1;
    this.getGoogleMerchantProducts();
  }


  deleteProduct(product: GoogleProduct) {
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + product.gtin +  ": " +  product.title  + "?"  )
      .then(e => {
        if (e.value) {
          product.inLoading = true;
          this.googleMerchantService.deleteProduct(this.saleApp.googleMerchantUserId, product.gid)
            .subscribe(() => {
              product.inLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
              this.getGoogleMerchantProducts();
            },() => {
              product.inLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
            });
        }
      });
  }

  addProduct() {
    const ref = this.matDialog.open(ProductListComponent, {
      width: '95%',
      height: '95%',
      autoFocus: true,
      disableClose: false,
      data: {userId: this.saleApp.googleMerchantUserId, saleApp: this.saleApp},
    });
    ref.afterClosed().subscribe(() => {
      this.getGoogleMerchantProducts();
    });
  }

  getProductStatus(product: GoogleProduct){
    const status = product.status.destinationStatuses.find(s =>
      s.destination.toLowerCase() === 'SurfacesAcrossGoogle'.toLowerCase());
    return status.status;
  }

  updateProduct(product: GoogleProduct) {
    product.inLoading = true;
    const ref = this.matDialog.open(ProductMgmComponent, {
      width: 'auto',
      autoFocus: true,
      disableClose: false,
      data: {saleApp: this.saleApp, product: product, editMode: true},
    });
    ref.afterClosed().subscribe(() => {
      product.inLoading = false;
      this.getGoogleMerchantProducts();
    });
  }



  selectPageProducts($event) {
    for (let i =0; i<this.productToDeleteList.length; i++) {
      this.productToDeleteList[i] = $event.checked;
    }
  }

  isThereSelectedProductsToAdd(): boolean {
    for (const r of this.productToDeleteList) {
      if (r === true) {
        return true;
      }
    }
    return false;
  }

  getSelectedNbr(): number {
    let nbr =0;
    for (const r of this.productToDeleteList) {
      if (r === true) {
        nbr++;
      }
    }
    return nbr;
  }

  deleteSelectedProductFromGoogleMerchant() {
    const pl: string[] = [];
    for (let i =0; i<this.productToDeleteList.length; i++) {
      if (this.productToDeleteList[i] === true) {
        pl.push(this.googleProductsResponse.data[i].id);
      }
    }
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + pl.length + ' prodotti selezionati ?')
      .then(e => {
        if (e.value) {
          this.productSelectedToDeleteInLoading = true;
          this.googleMerchantService.deleteProductList(this.saleApp.googleMerchantUserId, pl).subscribe(
            (response) => {
              this.allProductSelected = false;
              this.productToDeleteList = new Array(this.googleProductsResponse.data.length);
              this.productSelectedToDeleteInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
            }, (error) => {
              this.productSelectedToDeleteInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
            });
        }
      });
  }

  deleteAllProductFromGoogleMerchant() {
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + ' tutti prodotti ?')
      .then(e => {
        if (e.value) {
          this.productAllToDeleteInLoading = true;
          this.googleMerchantService.deleteAllProduct(this.saleApp.googleMerchantUserId).subscribe(
            (response) => {
              this.productAllToDeleteInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
            }, (error) => {
              this.productAllToDeleteInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
            });
        }
      });
  }

  synchronizeGoogle() {
    console.log("synchronize Google start ... ");
    this.syncInLoading = true;
    console.log("userId = ", this.saleApp.googleMerchantUserId)
    this.googleMerchantService.synchronizeGoogleTO(this.saleApp.googleMerchantUserId).subscribe((response) => {
      console.log("synchronize Google = ", response);
      this.syncInLoading = false;
      this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      this.getGoogleMerchantProducts();
    }, (error) => {console.log('error = ', error); this.syncInLoading = false;})
  }


  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }
}
