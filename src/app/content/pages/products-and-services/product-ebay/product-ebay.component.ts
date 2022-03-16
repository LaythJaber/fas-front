import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SaleApp} from "../../../../shared/models/sale-app/sale-app";
import {SearchResponse} from "../../../../shared/dto/search-response";
import {
  GoogleProductStatusEnum,
  SaleAppProductAvailability
} from "../../../../shared/models/sale-app/google/google-product";
import {SaleAppService} from "../../../../shared/services/sale-app/sale-app.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {debounceTime} from "rxjs/operators";
import {EbayService} from "../../../../shared/services/sale-app/ebay.service";
import {EbayInventoryItem} from "../../../../shared/models/sale-app/ebay/ebay-inventory-item";
import {EbayProductPageRequest} from "../../../../shared/models/sale-app/ebay/ebay-product-page-request";
import {ProductListComponent} from "./components/product-list/product-list.component";
import {ProductMgmService} from "../../../../shared/services/product-mgm.service";
import {ProductOffersComponent} from "./components/product-offers/product-offers.component";

@Component({
  selector: 'app-product-ebay',
  templateUrl: './product-ebay.component.html',
  styleUrls: ['./product-ebay.component.scss']
})
export class ProductEbayComponent implements OnInit {

  columns = [
    'DATA_TABLE.IMAGE',
    'DATA_TABLE.SKU',
    'DATA_TABLE.EAN_CODE',
    'DATA_TABLE.TITLE',
    'DATA_TABLE.DESCRIPTION',
    'DATA_TABLE.STOCK',
    'DATA_TABLE.BRAND',
    'DATA_TABLE.CONDITION',
  ];

  filterForm: FormGroup;
  availabilityList: {id: string, label: string }[];
  statusList: {id: string, label: string }[];

  saleApp: SaleApp;
  ebayConfig: any;
  ebayResponse: SearchResponse<EbayInventoryItem>;
  request: EbayProductPageRequest;



  allProductSelected: boolean = false;
  productToDeleteList: boolean[] = [];
  productSelectedToDeleteInLoading: boolean = false;
  productAllToDeleteInLoading: boolean = false;
  productsInLoading: boolean = false;

  syncInLoading: boolean = false;

  constructor(
    private saleAppService: SaleAppService,
    private ebayService: EbayService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private sweetAlertService: SweetAlertService,
    private productService: ProductMgmService
  ) {
    this.initRequest();
    this.getSaleApp();
  }

  ngOnInit() {
    this.getLists();
    this.initFilterForm();
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
        this.getEbayProducts();
      });

    this.filterForm.get('availability').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.availability = v;
        this.getEbayProducts();
      });

    this.filterForm.get('status').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.status = v;
        this.getEbayProducts();
      });

    this.filterForm.get('expirationDate').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        if (v) {
          v = v.format().substring(0,10);
        }
        this.request.page = 1;
        this.request.expirationDate = v;
        this.getEbayProducts();
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
      if (this.saleApp && this.saleApp.ebayEnabled) {
        this.getEbayConfig(this.saleApp.ebayUuid)
      }
      else {
        this.sweetAlertService.notification('Devi attivare Ebay Products').then(e => {});
      }
    })
  }

  getEbayConfig(clientId: string) {
    this.saleAppService.getEbayConfig(clientId).subscribe((response) => {
      this.ebayConfig = response;
      this.getEbayProducts();
    });
  }

  nextPage() {
    this.request.page++;
    this.getEbayProducts();
  }

  prevPage() {
    this.request.page--;
    this.getEbayProducts();
  }

  initRequest() {
    this.request = new EbayProductPageRequest();
    this.request.page = 1;
    this.request.pageSize = 10;
    this.request.textSearch = '';
  }

  getEbayProducts() {
    this.ebayService.getProductList(this.ebayConfig.uuid, this.request)
      .subscribe((response) => {
        console.log('Products ebay = ', response);
        this.ebayResponse = response;
        this.productToDeleteList = new Array(this.ebayResponse.data.length);
        this.allProductSelected = false;
        this.productsInLoading = false;
      }, (error) => {
        this.productsInLoading = false;
      });
  }

  pageChange(page: number) {
    this.request.page = page;
    this.getEbayProducts();
  }

  showRows() {
    this.request.page=1;
    this.getEbayProducts();
  }

  synchronizeEbay() {
    console.log("synchronize Ebay start ... ");
    this.syncInLoading = true;
    this.ebayService.synchronizeEbay(this.ebayConfig.uuid).subscribe((response) => {
      console.log("synchronize Ebay = ", response);
      this.syncInLoading = false;
      this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      this.getEbayProducts();
    }, () => {this.syncInLoading = false;})
  }


  deleteProduct(item: EbayInventoryItem) {
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + item.sku +  ": " +  item.product.title  + "?"  )
      .then(e => {
        if (e.value) {
          item.inLoading = true;
          this.ebayService.deleteProduct(this.saleApp.ebayUuid, item.sku)
            .subscribe(() => {
              item.inLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
              this.getEbayProducts();
            },() => {
              item.inLoading = false;
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
      data: {saleApp: this.saleApp},
    });
    ref.afterClosed().subscribe(() => {
      this.getEbayProducts();
    });
  }

  openProductOffersModal(item: EbayInventoryItem) {
    const ref = this.matDialog.open(ProductOffersComponent, {
      width: '95%',
      height: '95%',
      autoFocus: true,
      disableClose: false,
      data: {ebayConfig: this.ebayConfig, item: item},
    });
    ref.afterClosed().subscribe(() => {
      this.getEbayProducts();
    });
  }

  updateItemForm: FormGroup;
  initUpdateItemForm() {
    this.updateItemForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      brand: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      ean: new FormControl(null, Validators.required),
    });
  }

  modalRef;
  openUpdateProduct(modal, item: EbayInventoryItem) {
    this.initUpdateItemForm();
    this.updateItemForm.get('title').setValue(item.product.title);
    this.updateItemForm.get('description').setValue(item.product.description);
    this.updateItemForm.get('quantity').setValue(item.availability.shipToLocationAvailability.quantity);
    this.updateItemForm.get('ean').setValue(item.product.ean[0]);
    this.updateItemForm.get('brand').setValue(item.product.brand);
    this.modalRef = this.matDialog.open(modal, {
      width: 'auto',
      height: '90%',
      autoFocus: true,
      disableClose: false,
    });
    this.modalRef.afterClosed().subscribe((d) => {
      console.log("d = ", d);
      if (d === true) {
        item.inLoading = true;
        item.product.title = this.updateItemForm.get('title').value;
        item.product.description = this.updateItemForm.get('description').value;
        item.product.brand = this.updateItemForm.get('brand').value;
        item.availability.shipToLocationAvailability.quantity = this.updateItemForm.get('quantity').value;
        const ean = this.updateItemForm.get('ean').value;
        item.product.ean = [];
        item.product.ean.push(ean);
        item.product.upc.push(ean);
        item.product.aspects = null;
        console.log("updated item =  ", item);
        this.ebayService.addProduct(this.ebayConfig.uuid, item.sku, 'en-US', item).subscribe((response) => {
          item.inLoading = false;
          console.log('update item response = ', response);
          this.getEbayProducts();
        });
      }
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

  async addSelectedProductsToEbay() {
    this.sweetAlertService
      .warning('Vuoi davvero creare offerte e pubblicarle per i prodotti selezionati ?')
      .then(async e => {
        if (e.value) {
          this.productSelectedToDeleteInLoading = true;
          const offers: any[] = [];
          for (let i = 0; i < this.productToDeleteList.length; i++) {
            if (this.productToDeleteList[i] === true) {
              const inventoryItem = this.ebayResponse.data[i];
              await this.productService.getById(inventoryItem.sku).toPromise().then(product => {
                const ebayOffer = this.ebayService.mapToEbayOffer(inventoryItem, product, this.ebayConfig, 1, null);
                console.log('offer = ', ebayOffer);
                offers.push(ebayOffer);
              });
            }
          }

          console.log("offers list = ", offers);
          this.ebayService.addListOffer(this.ebayConfig.uuid, offers).subscribe((response) => {
            console.log("response add offers = ", response);
            this.productSelectedToDeleteInLoading = false;
            this.snackBar.open(this.translateService.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000});
            this.getEbayProducts();
          }, error => {
            this.productSelectedToDeleteInLoading = false;
            this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
          });
        }
      });
  }

  deleteSelectedProductFromEbay() {
    const skus: string[] = [];
    for (let i =0; i<this.productToDeleteList.length; i++) {
      if (this.productToDeleteList[i] === true) {
        skus.push(this.ebayResponse.data[i].sku);
      }
    }
    console.log('skus = ', skus);
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + skus.length + ' prodotti selezionati ?')
      .then(e => {
        if (e.value) {
          this.productSelectedToDeleteInLoading = true;
          this.ebayService.deleteProductList(this.saleApp.ebayUuid, skus).subscribe(
            (response) => {
              this.allProductSelected = false;
              this.productToDeleteList = new Array(this.ebayResponse.data.length);
              this.productSelectedToDeleteInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
              this.getEbayProducts();
            }, (error) => {
              this.productSelectedToDeleteInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
            });
        }
      });
  }

  deleteAllProductFromEbay() {
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + ' tutti prodotti ?')
      .then(e => {
        if (e.value) {
          this.productAllToDeleteInLoading = true;
          this.ebayService.deleteAllProduct(this.saleApp.ebayUuid).subscribe(
            (response) => {
              this.productAllToDeleteInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
              this.getEbayProducts();
            }, (error) => {
              this.productAllToDeleteInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
            });
        }
      });
  }

}
