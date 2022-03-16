import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SaleApp} from "../../../../shared/models/sale-app/sale-app";
import {SearchResponse} from "../../../../shared/dto/search-response";
import {SaleAppService} from "../../../../shared/services/sale-app/sale-app.service";
import {EbayService} from "../../../../shared/services/sale-app/ebay.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {ProductMgmService} from "../../../../shared/services/product-mgm.service";
import {debounceTime} from "rxjs/operators";
import {AmazonService} from "../../../../shared/services/sale-app/amazon.service";
import {AmazonProductPageRequest} from "../../../../shared/models/sale-app/amazon/amazon-product-page-request";
import {AmazonProduct, AmazonProductStatus} from "../../../../shared/models/sale-app/amazon/amazon-product";
import {ProductListComponent} from "./components/product-list/product-list.component";

@Component({
  selector: 'app-product-amazon',
  templateUrl: './product-amazon.component.html',
  styleUrls: ['./product-amazon.component.scss']
})
export class ProductAmazonComponent implements OnInit {

  columns = [
    // 'DATA_TABLE.IMAGE',
    'DATA_TABLE.SKU',
    'DATA_TABLE.TITLE',
    'DATA_TABLE.DESCRIPTION',
    'DATA_TABLE.PRICE',
    'DATA_TABLE.QUANTITY',
    'DATA_TABLE.STATUS',
    'DATA_TABLE.ASIN',
    'DATA_TABLE.LISTING_ID',
    'DATA_TABLE.FULFILLMENT_CHANNEL'
  ];

  filterForm: FormGroup;
  statusList: {id: string, label: string }[];

  saleApp: SaleApp;
  amazonConfig: any;
  amazonResponse: SearchResponse<AmazonProduct>;
  request: AmazonProductPageRequest;



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
    private productService: ProductMgmService,
    private amazonService: AmazonService
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
      status: new FormControl(null)
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.textSearch = v;
        this.getAmazonProducts();
      });

    this.filterForm.get('status').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.status = v;
        this.getAmazonProducts();
      });
  }

  getLists() {
    this.statusList =  Object.keys(AmazonProductStatus)
      .map((key) => {return {id: AmazonProductStatus[key], label: key}});
  }

  getSaleApp() {
    this.saleAppService.getSaleApp().subscribe((response)=> {
      this.saleApp = response;
      if (this.saleApp && this.saleApp.amazonEnabled) {
        this.getAmazonConfig(this.saleApp.amazonUuid)
      }
      else {
        this.sweetAlertService.notification('Devi attivare Amazon Articoli').then(e => {});
      }
    })
  }

  getAmazonConfig(uuid: string) {
    this.saleAppService.getAmazonConfig(uuid).subscribe((response) => {
      this.amazonConfig = response;
      this.getAmazonProducts();
    });
  }

  nextPage() {
    this.request.page++;
    this.getAmazonProducts();
  }

  prevPage() {
    this.request.page--;
    this.getAmazonProducts();
  }

  initRequest() {
    this.request = new AmazonProductPageRequest();
    this.request.page = 1;
    this.request.pageSize = 10;
    this.request.textSearch = '';
  }

  getAmazonProducts() {
    this.amazonService.getProducts(this.amazonConfig.uuid, this.request)
      .subscribe((response) => {
        console.log('Products amazon = ', response);
        this.amazonResponse = response;
        this.productToDeleteList = new Array(this.amazonResponse.data.length);
        this.allProductSelected = false;
        this.productsInLoading = false;
      }, () => {
        this.productsInLoading = false;
      });
  }

  pageChange(page: number) {
    this.request.page = page;
    this.getAmazonProducts();
  }

  showRows() {
    this.request.page=1;
    this.getAmazonProducts();
  }

  synchronizeAmazon() {
    console.log("synchronize Amazon start ... ");
    this.syncInLoading = true;
    this.amazonService.synchronizeAmazon(this.amazonConfig.uuid).subscribe((response) => {
      console.log("synchronize Amazon response = ", response);
      this.syncInLoading = false;
      this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      this.getAmazonProducts();
    }, () => {this.syncInLoading = false;})
  }


  deleteProduct(item: AmazonProduct) {
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + item.sellerSku +  ": " +  item.itemName  + "?"  )
      .then(e => {
        if (e.value) {
          item.inLoading = true;
          this.amazonService.deleteProduct(this.saleApp.amazonUuid, item.sellerSku)
            .subscribe((r: any) => {
              item.inLoading = false;
              if (r != null && r.status === "ACCEPTED") {
                this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
                this.getAmazonProducts();
              }
              else {
                this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
              }
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
      this.getAmazonProducts();
    });
  }

  modalRef;

}
