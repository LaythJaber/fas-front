import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PurchaseService} from "../../../../shared/services/purchase/purchase-service";
import {Purchase} from "../../../../shared/models/purchase/purchase";
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ChangePurchaseStateRequest} from "../../../../shared/models/purchase/change-purchase-state-request";
import {TranslateService} from "@ngx-translate/core";
import {PurchaseRow} from "../../../../shared/models/purchase/purchase-row";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {Transaction} from "../../../../shared/models/transaction/transaction";
import {TransactionService} from "../../../../shared/services/transaction/transaction.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PluginConfigService} from "../../../../shared/services/plugin/plugin-config.service";
import {PluginConfiguration} from "../../../../shared/models/plugin/plugin-configuration";
import {Location} from "@angular/common";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {PriceService} from "../../../../shared/services/price-service";
import {PurchaseState} from "../../../../shared/models/purchase/purchase-state";
import {CartProductModalComponent} from "../../../../shared/compoenent/cart-product-modal/cart-product-modal.component";
import {ProductFilterModalComponent} from "../../../../shared/component/product-filter-modal/product-filter-modal.component";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {Product} from "../../../../shared/models/product";

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss']
})
export class PurchaseDetailsComponent implements OnInit {

  purchaseId: number;
  purchase: Purchase;
  pluginConfiguration: PluginConfiguration;

  modal: any;
  stateForm: FormGroup;

  stateList: {id: string; label: string }[];

  transactionList: Transaction[] = [];
  onlineTransaction: Transaction;

  constructor(
    public priceService: PriceService,
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private matDialog: MatDialog,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private pluginConfigService: PluginConfigService,
    private location: Location,
    private http: HttpClient,
    private sweetAlertService: SweetAlertService,
  ) {
    this.sendBreadCrumb();
    this.getPluginConfigurationDetails();
    this.route.params.subscribe((params) => {
      this.purchaseId = params.id;
      this.getPurchaseDetails(this.purchaseId);
      this.getPurchaseTransaction(this.purchaseId);
    });
  }

  ngOnInit() {
  }

  getPluginConfigurationDetails() {
    this.pluginConfigService.getPluginConfiguration().subscribe((response) => {
      this.pluginConfiguration = response;
      console.log("plugin config = ", this.pluginConfiguration);
    });
  }

  getPurchaseTransaction(purchaseId: number) {
    this.transactionService.getPurchaseTransactions(purchaseId).subscribe((response) => {
      this.transactionList = response;
      this.onlineTransaction = this.transactionList.find(t => (t.payment.type.toString() === 'STRIPE' || t.payment.type.toString() === 'PAYPAL'));
      console.log('ts = ', this.transactionList);
    });
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['PURCHASE']);
  }

  initForms() {
    this.stateForm = new FormGroup({
      state: new FormControl(null, Validators.required),
      note: new FormControl(null)
    });

    switch (this.purchase.state.toString()) {
      case 'NEW': {
        this.stateList = [
          {id: 'IN_PREPARATION', label: this.translate.instant('PURCHASE_FORM.STATE.IN_PREPARATION')},
          {id: 'CANCELED', label: this.translate.instant('PURCHASE_FORM.STATE.CANCELED')}
          ];
        break;
      }
      case 'IN_PREPARATION': {
        this.stateList = [
          {id: 'IN_DELIVERY', label: this.translate.instant('PURCHASE_FORM.STATE.IN_DELIVERY')},
          {id: 'CANCELED', label: this.translate.instant('PURCHASE_FORM.STATE.CANCELED')}
          ];
        break;
      }
      case 'IN_DELIVERY': {
        this.stateList = [
          {id: 'DELIVERED', label: this.translate.instant('PURCHASE_FORM.STATE.DELIVERED')},
          {id: 'REJECTED', label: this.translate.instant('PURCHASE_FORM.STATE.REJECTED')}
          ];
        break;
      }
    }
  }

  getPurchaseDetails(purchaseId: number, i: number = -1) {
    this.purchaseService.getPurchaseDetails(purchaseId).subscribe(
      (response) => {
        console.log('purchase = ', response);
        this.purchase = response;
        if (i != -1) {
          const rowp = this.purchase.purchaseRowList[i];
          if (rowp) {
            console.log("row p from p d = ", rowp);
            rowp.editQte = true;
            setTimeout(() => {
              document.getElementById('row_'+rowp.id).focus();
            }, 0);
          }
        }
      });
  }

  canChangeState(purchase: Purchase): boolean {
    return purchase.state.toString() === 'NEW' || purchase.state.toString() === 'IN_PREPARATION'
      || purchase.state.toString() ===  'IN_DELIVERY';
  }

  openModalState(modal) {
    this.initForms();
    this.modal = this.matDialog.open(modal, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
    this.modal.afterClosed().subscribe((d) => {
      if (d === true) {
        this.purchase.stateInChange = true;
        const request: ChangePurchaseStateRequest = new ChangePurchaseStateRequest();
        request.purchaseId = this.purchase.id;
        request.note = this.stateForm.get('note').value;
        request.newState = this.stateForm.get('state').value;
        this.purchaseService.changePurchaseState(request).subscribe(
          (response) => {
            this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
            this.getPurchaseDetails(this.purchase.id);
            this.getPurchaseTransaction(this.purchase.id);
          },
          (error) => {
            console.log('change error = ', error);
            this.purchase.stateInChange = false;
          });
      }
    });
  }

  openModal(modal, wdh: string = '800px') {
    this.modal = this.matDialog.open(modal, {
      width: wdh,
      autoFocus: true,
      disableClose: true,
    });
    this.modal.afterClosed().subscribe((d) => {});
  }


  saveQte(row: PurchaseRow, i:number = -1) {
    console.log('saveQte called !!!');
    // @ts-ignore
    let v = document.getElementById('row_'+row.id).value;
    if (v) {
      if (row.weighted) {
        v = v/row.weight;
      }
      console.log('quantity = ', v);
      let request = {
        purchaseId: this.purchase.id,
        rowId: row.id,
        quantity: v
      };
      this.purchaseService.changeDeliveredQuantity(request).subscribe(() => {
        row.quantityDelivered = v;
        row.editQte = false;
        this.getPurchaseDetails(this.purchase.id, i);
      });
    }
  }

  passToOtherRow($event, row: PurchaseRow, i: number, shift: boolean = false) {
    $event.stopPropagation();
    const index = shift ? i-1 : i+1;
    const rowp = this.purchase.purchaseRowList[index];
    if (rowp) {
      rowp.editQte = true;
      setTimeout(() => {
        document.getElementById('row_'+rowp.id).focus();
      }, 0);
    }
    this.saveQte(row, index);
  }

  resendPurchaseToFoodManager(purchase: Purchase) {
    purchase.stateInChange = true;
    this.purchaseService.resendPurchaseToFoodManager(purchase.id).subscribe(
      () => {
        purchase.stateInChange = false;
        this.getPurchaseDetails(purchase.id);
        }, () => {
        purchase.stateInChange = false;
      });
  }

  resendPurchaseToSellPoint(purchase: Purchase) {
    purchase.stateInChange = true;
    this.purchaseService.resendPurchaseToSellPoint(purchase.id).subscribe(
      (response) => {
        purchase.stateInChange = false;
        this.getPurchaseDetails(purchase.id);
      }, (error) => {
        purchase.stateInChange = false;
      });
  }


  /********* billing file upload *************/

  downloadAttachment (url: string, name: string) {
    this.http.get(url, {
      responseType: 'blob'
    }).subscribe(blob => {
      console.log('resp dw = ', blob);
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = name;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  billingFile: any;
  fileChange($event: Event) {
    this.billingFile = ($event.target as HTMLInputElement).files[0];
  }

  removeBillingFile() {
    this.purchase.billingInUpload = true;
    this.purchaseService.removeBillingFile(this.purchase.id).subscribe((response: HttpResponse<any>) => {
      this.purchase.billingInUpload = false;
      if (response.status === 200) {
        this.purchase.billingUrl = null;
      }
    }, () => {this.purchase.billingInUpload = false;});
  }

  openModalBilling(modal) {
    this.modal = this.matDialog.open(modal, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
    this.modal.afterClosed().subscribe((d) => {
      if (d === true) {
        this.purchase.billingInUpload = true;
        const request: FormData = new FormData();
        request.append('billingFile', this.billingFile);
        this.purchaseService.uploadBillingFile(this.purchase.id, request).subscribe((response: HttpResponse<any>) => {
          this.purchase.billingInUpload = false;
          if (response.status === 200) {
            this.purchase.billingUrl = response.body.billingUrl;
          }
        }, () => { this.purchase.billingInUpload = false;});
      }
    });
  }

  isInDelivery(purchase: Purchase): boolean {
    return purchase.state.toString() === 'IN_DELIVERY' || purchase.state.toString() === 'DELIVERED';
  }



  /******************* picking list *********************/
  generatePickingListFile(type: 'RECEIPT' | 'PICKING') {
    console.log("start generating picking file !!!!");
    const fileName: string = type === 'PICKING' ? 'picking-'+this.purchase.code + '.pdf' : 'receipt-'+this.purchase.code + '.pdf';
    if (type === 'PICKING') {
      this.purchase.pickingInChange = true;
    }
    else if (type === 'RECEIPT') {
      this.purchase.receiptInChange = true;
    }
    this.purchaseService.generatePickingListFile(this.purchase.id, type).subscribe((blob) => {
      console.log("generate picking list file response = ", blob);
      if (type === 'PICKING') {
        this.purchase.pickingInChange = false;
      }
      else if (type === 'RECEIPT') {
        this.purchase.receiptInChange = false;
      }
      if (blob !== null) {
        console.log('resp dw = ', blob);
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    }, (error) => {
      console.log("generate picking list file error = ", error);
      if (type === 'PICKING') {
        this.purchase.pickingInChange = false;
      }
      else if (type === 'RECEIPT') {
        this.purchase.receiptInChange = false;
      }
    });
  }

  removePickingListFile(type: 'RECEIPT' | 'PICKING') {
    this.purchase.receiptInChange = true;
    this.purchaseService.removePickingListFile(this.purchase.id, type).subscribe((response: HttpResponse<any>) => {
      this.purchase.receiptInChange = false;
      if (response.status === 200) {
        if (type === 'PICKING') {
          this.purchase.pickingListUrl = null;
        }
        else if (type === 'RECEIPT') {
          this.purchase.receiptUrl = null;
        }
      }
    }, () => {this.purchase.receiptInChange = false;});
  }


  openProductFilterModal(row: PurchaseRow = null) {
    const dialogRef = this.matDialog.open(ProductFilterModalComponent, {
      width: '450%',
      height: '95%',
      autoFocus: true,
      disableClose: false,
      data: { purchase: this.purchase, row: row }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.purchase = response;
      }
    });
  }

  removeRow(row: PurchaseRow) {
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + row.product.commercialDescription + "?"  )
      .then(e => {
        if (e.value) {
          // row.inLoading = true;
          this.purchaseService.removeProductFromPurchase(this.purchaseId, row.id)
            .subscribe((r: any) => {
              console.log('response remove response = ', r);
              // item.inLoading = false;
              this.purchase = r;

            },() => {
              // item.inLoading = false;
              this.snackBar.open(this.translate.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
            });
        }
      });
  }

  getValidStock(product: Product) {
    if (product && product.availability) {
      let availability = product.availability;
      let unit = 'pz';
      if (product.weighted) {
        availability = Number(availability.toFixed(3));
        unit = product.measureUnit ? product.measureUnit.description : '';
      }
      return availability + ' ' + unit;
    }
  }

  goBack() {
    this.location.back();
  }

}
