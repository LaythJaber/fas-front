import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {Location} from '@angular/common';
import {PluginConfigService} from '../../../../shared/services/plugin/plugin-config.service';
import {ReturnPurchaseService} from '../../../../shared/services/return-product/return-purchase.service';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {ReturnPurchase} from '../../../../shared/models/return-product/return-purchase';
import {Transaction} from '../../../../shared/models/transaction/transaction';
import {ReturnProduct} from '../../../../shared/models/return-product/return-product';
import {TransactionService} from '../../../../shared/services/transaction/transaction.service';
import {ReturnProductState} from '../../../../shared/models/return-product/return-product-state';
import {ReturnPurchaseState} from '../../../../shared/models/return-product/return-purchase-state';
import {ChangeReturnProductStateRequest} from '../../../../shared/models/return-product/change-return-product-state-request';
import {Purchase} from '../../../../shared/models/purchase/purchase';
import {ReturnInstructionAttachment} from '../../../../shared/models/return-product/return-instruction-attachment';
import {PriceService} from "../../../../shared/services/price-service";

@Component({
  selector: 'app-return-purchase-details',
  templateUrl: './return-purchase-details.component.html',
  styleUrls: ['./return-purchase-details.component.scss']
})
export class ReturnPurchaseDetailsComponent implements OnInit {

  constructor(
    public priceService: PriceService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private matDialog: MatDialog,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private pluginConfigService: PluginConfigService,
    private returnPurchaseService: ReturnPurchaseService,
    private sweetAlertService: SweetAlertService,
    private location: Location
  ) {
    this.sendBreadCrumb();
    this.route.params.subscribe((params) => {
      this.getReturnPurchaseDetails(params.id);
    });
  }

  returnPurchase: ReturnPurchase;

  modal: any;
  stateForm: FormGroup;

  stateList: {id: string; label: string }[];

  transactionList: Transaction[] = [];
  onlineTransaction: Transaction;

  selectedMessage: string;
  selectedReturnProduct: ReturnProduct;

  filesM: any[] = [];

  ngOnInit() {
  }


  getPurchaseTransaction(purchaseId: number) {
    this.transactionService.getPurchaseTransactions(purchaseId).subscribe((response) => {
      this.transactionList = response;
      this.onlineTransaction = this.transactionList.find(t => (t.payment.type.toString() === 'STRIPE'
                              || t.payment.type.toString() === 'PAYPAL'));
      console.log('ts = ', this.transactionList);
    });
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'RETURN_PRODUCT']);
  }

  initForms() {
    this.stateForm = new FormGroup({
      state: new FormControl(null, Validators.required),
      note: new FormControl(null),
      quantityRefunded: new FormControl(null),
      totalRefunded: new FormControl(null)
    });

    switch (this.selectedReturnProduct.state) {
      case ReturnProductState.PENDING: {
        this.stateList = [
          {id: ReturnProductState.RECEIVED, label: ReturnProductState.RECEIVED},
          {id: ReturnProductState.REJECTED, label: ReturnProductState.REJECTED}
        ];
        break;
      }
      case ReturnProductState.RECEIVED: {
        this.stateList = [
          {id: ReturnProductState.PENDING_REIMBURSEMENT, label: ReturnProductState.PENDING_REIMBURSEMENT},
          {id: ReturnProductState.REJECTED, label: ReturnProductState.REJECTED}
        ];
        break;
      }
      case ReturnProductState.PENDING_REIMBURSEMENT: {
        this.stateList = [
          {id: ReturnProductState.REFUNDED, label: ReturnProductState.REFUNDED},
          {id: ReturnProductState.REJECTED, label: ReturnProductState.REJECTED}
        ];
        break;
      }
    }
  }
  fileChange($event: Event) {
    this.filesM = [];
    for (let i = 0; i < ($event.target as HTMLInputElement).files.length ; i++) {
      const file = ($event.target as HTMLInputElement).files[i];
      this.filesM.push(file);
    }
  }

  getReturnPurchaseDetails(returnPurchaseId: number) {
    this.returnPurchaseService.getReturnPurchaseDetails(returnPurchaseId).subscribe(
      (response) => {
        this.returnPurchase = response;
        console.log('return purchase = ', response);
      });
  }

  closeReturnPurchase(returnPurchase: ReturnPurchase) {
    this.sweetAlertService
      .warning('Sei sicuro di voler chiudere questa cartella ?')
      .then(e => {
        if (e.value) {
          returnPurchase.stateInChange = true;
          this.returnPurchaseService.changeReturnPurchaseState(returnPurchase.id).subscribe(
            (response) => {
              returnPurchase.stateInChange = false;
              if (response.status === 200) {
                returnPurchase.state = ReturnPurchaseState.CLOSED;
                this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
              }
            },
            (error) => {
              console.log('error = ', error);
              returnPurchase.stateInChange = false;
              this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_UPDATE') + ' '
                + returnPurchase.id);
            }
          );
        }
      });
  }

  canChangeState(returnProduct: ReturnProduct): boolean {
    return returnProduct.state === 'PENDING' || returnProduct.state === 'RECEIVED'
      || returnProduct.state ===  'PENDING_REIMBURSEMENT';
  }

  getMaxQteToReturn() {
    let qte: number  = this.selectedReturnProduct?.quantity;
    let unit: string  = 'pz';
    if (this.selectedReturnProduct?.product?.weighted) {
      qte = (this.selectedReturnProduct.quantity * this.selectedReturnProduct.product?.weight)/1000.0;
      unit = this.selectedReturnProduct.product?.measureUnit?.description;
    }
    return qte + unit;
  }

  getUnit(): string {
    let unit: string  = 'pz';
    if (this.selectedReturnProduct?.product?.weighted) {
      unit = this.selectedReturnProduct?.product?.weightUm === 'GR' ? 'gramme' : 'milli-litre';
    }
    return unit;
  }


  openModalState(modal, row: ReturnProduct) {
    this.selectedReturnProduct = row;
    this.initForms();
    this.modal = this.matDialog.open(modal, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
    this.modal.afterClosed().subscribe((d) => {
      if (d === true) {
        row.stateInChange = true;
        const formData = new FormData();
        if (this.filesM.length) {
          for (const f of this.filesM) {
            formData.append('files', f, f.name);
          }
        }

        const request: ChangeReturnProductStateRequest = new ChangeReturnProductStateRequest();
        request.returnProductId = row.id;
        request.note = this.stateForm.get('note').value;
        request.newState = this.stateForm.get('state').value;
        request.quantityRefunded = this.stateForm.get('quantityRefunded').value;
        if (this.selectedReturnProduct?.product?.weighted) {
          request.quantityRefunded = request.quantityRefunded / this.selectedReturnProduct?.product?.weight;
        }
        console.log('qte  = ', request.quantityRefunded);
        request.totalRefunded = this.stateForm.get('totalRefunded').value;
        formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));

        console.log('request = ', request);
        console.log('files = ', this.filesM);

        this.returnPurchaseService.changeReturnProductState(formData).subscribe(
          (response) => {
            row.stateInChange = false;
            this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
            this.getReturnPurchaseDetails(this.returnPurchase.id);
          },
          (error) => {
            console.log('change error = ', error);
            this.snackBar.open(this.translate.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
            row.stateInChange = false;
          });
      }
    });
  }

  isValidStateData(): boolean {
    const state =  this.stateForm.get('state').value;

    if (state === ReturnProductState.REFUNDED) {
      const qte = this.stateForm.get('quantityRefunded').value;
      if (qte < 0) {
        return false;
      }
      const totRef = this.stateForm.get('totalRefunded').value;
      if (!totRef) {
        return false;
      }
    }
    return true;
  }

  openModal(modal, wdh: string = '800px') {
    this.modal = this.matDialog.open(modal, {
      width: wdh,
      autoFocus: true,
      disableClose: true,
    });
    this.modal.afterClosed().subscribe((d) => {});
  }

  downloadAttachment (attachment: ReturnInstructionAttachment) {
    this.http.get(attachment.attachment, {
      responseType: 'blob'
    }).subscribe(blob => {
      console.log('resp dw = ', blob);
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = attachment.name;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  getDeliveredDate(purchase: Purchase): string {
    const state = purchase.stateHistoryList.find(s => s.state.toString() === 'DELIVERED');
    if (state) {
      return state.createdAt;
    }
  }

  goBack() {
    this.location.back();
  }

}
