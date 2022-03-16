import {Component, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EbayService} from "../../../../../../shared/services/sale-app/ebay.service";
import {EbayInventoryItem} from "../../../../../../shared/models/sale-app/ebay/ebay-inventory-item";
import {ProductMgmService} from "../../../../../../shared/services/product-mgm.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../../../../../shared/models/product";
import * as moment from 'moment';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {SweetAlertService} from "../../../../../../shared/services/sweet-alert.service";

@Component({
  selector: 'app-product-offers',
  templateUrl: './product-offers.component.html',
  styleUrls: ['./product-offers.component.scss']
})
export class ProductOffersComponent implements OnInit {

  dialogRef: any;
  data: any;

  product: Product;
  offersResponse: any;
  loading: boolean = true;
  addLoading: boolean = false;
  actionLoading: boolean = false;
  addOfferForm: FormGroup;
  updateOfferForm: FormGroup;

  constructor(
    private injector: Injector,
    private ebayService: EbayService,
    private productService: ProductMgmService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private sweetAlertService: SweetAlertService,
  ) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.data = this.injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit() {
    this.getOffers(this.data.item, true);
    this.getProductDetails(this.data.item.sku);
  }

  getProductDetails(productId) {
    this.productService.getById(productId).subscribe(product => {
      this.product = product;
    });
  }

  getOffers(item, loading: boolean = false) {
    if (loading) {
      this.loading = true;
    }
    this.ebayService.getOffersBySku(this.data.ebayConfig.uuid, item.sku, 'EBAY_US')
      .subscribe((response) => {
        console.log('response get offers = ', response);
        this.offersResponse = response;
        this.loading = false;
        }, () => {this.loading = false;});
  }


  initAddOfferForm() {
    this.addOfferForm = new FormGroup({
      quantity: new FormControl(null, Validators.required),
      availabilityDate: new FormControl(null),
      expirationDate: new FormControl(null)
    });
  }

  modalRef;
  openAddOfferFormModal(modal) {
    this.initAddOfferForm();
    this.modalRef = this.matDialog.open(modal,
      {
        disableClose: true,
        width: '500px',
      });
    this.modalRef.afterClosed().subscribe(d => {
      console.log("d = ", d);
      if (d === true) {
        this.addOffer(this.data.item);
      }
    });
  }

  addOffer(inventoryItem: EbayInventoryItem) {
    this.addLoading = true;
    const qte = this.addOfferForm.get('quantity').value;
    const startDate = this.addOfferForm.get('availabilityDate').value;
    const d = startDate ? moment(startDate).format() : null;
    const ebayOffer = this.ebayService.mapToEbayOffer(inventoryItem, this.product, this.data.ebayConfig, qte, d);
    console.log('offer = ', ebayOffer);
    this.ebayService.addOffer(this.data.ebayConfig.uuid, 'en-US', ebayOffer).subscribe((response) => {
      console.log('response add offer = ', response);
      this.addLoading = false;
      this.snackBar.open(this.translateService.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000});
      this.getOffers(this.data.item);
    }, () => {
      this.addLoading = false;
      this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_ADD'), 'Ok', {duration: 5000});
    });
  }

  publishOffer(offerId) {
    this.actionLoading = true;
    this.ebayService.publishOffer(this.data.ebayConfig.uuid, offerId).subscribe((response) => {
      console.log('response publish offer = ', response);
      this.actionLoading = false;
      if (response != null) {
        this.snackBar.open(this.translateService.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000});
      }
      else {
        this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_ADD'), 'Ok', {duration: 5000});
      }
      this.getOffers(this.data.item);
    }, ()=> {
      this.actionLoading = false;
      this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_ADD'), 'Ok', {duration: 5000});
    });
  }

  deleteOffer(offerId) {
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + offerId  + "?"  )
      .then(e => {
        if (e.value) {
          this.actionLoading = true;
          this.ebayService.deleteOffer(this.data.ebayConfig.uuid, offerId).subscribe((response) => {
            console.log('response delete offer = ', response);
            this.actionLoading = false;
            this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
            this.getOffers(this.data.item);
          },() => {
            this.actionLoading = false;
            this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
          });
        }
      });
  }



  initUpdateOfferForm() {
    this.updateOfferForm = new FormGroup({
      quantity: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required)
    });
  }

  selectedOffer;
  openUpdateOfferFormModal(modal, offer) {
    this.initUpdateOfferForm();
    this.selectedOffer = offer;
    this.updateOfferForm.get('quantity').setValue(offer.availableQuantity);
    this.updateOfferForm.get('price').setValue(offer.pricingSummary.price.value);
    this.modalRef = this.matDialog.open(modal,
      {
        disableClose: true,
        width: '500px',
      });
    this.modalRef.afterClosed().subscribe(d => {
      console.log("d = ", d);
      if (d === true) {
        offer.availableQuantity = this.updateOfferForm.get('quantity').value;
        offer.pricingSummary.price.value = this.updateOfferForm.get('price').value;
        console.log("updated offer = ", offer);
        this.updateOffer(offer);
      }
    });
  }

  updateOffer(offer) {
    this.actionLoading = true;
    this.ebayService.updateOffer(this.data.ebayConfig.uuid, 'en-US', offer.offerId, offer).subscribe((response) => {
      console.log('response update offer = ', response);
      this.actionLoading = false;
      this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      this.getOffers(this.data.item);
    },() => {
      this.actionLoading = false;
      this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
    });
  }

  close() {
    this.dialogRef.close(null);
  }

}
