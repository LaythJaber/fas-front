import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SweetAlertService} from "../../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {BreadcrumbService} from "../../../core/services/breadcrumb.service";
import {Router} from "@angular/router";
import {ShipmentService} from "../../../shared/services/shipment.service";
import {SellPointService} from "../../../shared/services/sell-point.service";
import {TransactionService} from "../../../shared/services/transaction.service";
import {FormControl, FormGroup} from "@angular/forms";
import {SearchResponse} from "../../../shared/dto/search-response";
import {SellPoint} from "../../../shared/models/sell-point";
import {Transaction} from "../../../shared/models/transaction/transaction";
import {TransactionPageRequest} from "../../../shared/models/transaction/transaction-page-request";

import * as Inputmask from 'inputmask';
import {debounceTime} from "rxjs/operators";
import {TransactionStatus} from "../../../shared/models/transaction/transaction-status";
import {TransactionModalComponent} from "./components/transaction-modal/transaction-modal.component";
import {PaymentService} from "../../../shared/services/payment/payment.service";
import {Payment} from "../../../shared/models/payment/payment";
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {


  @ViewChild('createAtElem') createAtElem: ElementRef;

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.CLIENTE',
    'DATA_TABLE.STATUS',
    'DATA_TABLE.PAYMENT',
    'DATA_TABLE.SELL_POINTS',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.UPDATED',
  ];

  stateList: {id: string, label: string }[];

  paymentList: Payment[] = [];

  filterForm: FormGroup;
  request: TransactionPageRequest = new TransactionPageRequest();
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  transactionResponse: SearchResponse<Transaction>;
  sellPointList: SellPoint[] = [];

  constructor(
    private transactionService: TransactionService,
    private matDialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private shipmentService: ShipmentService,
    private sellPointService: SellPointService,
    private localStorageService: LocalStorageService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.sendBreadCrumb();
    this.initFilterForm();
    this.request.page = 1;
    this.request.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.request.textSearch = '';
    this.getTransactions();
    this.getStateList();
    this.getPaymentList();
    this.getSellPointList();
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      status: new FormControl(null),
      paymentId: new FormControl(null),
      sellPointId: new FormControl(null),
      createdAt: new FormControl(null),
      updatedAt: new FormControl(null),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.getTransactions();
      });

    this.filterForm.get('status').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.state = value;
        console.log('state = ', this.request.state);
        this.getTransactions();
      });

    this.filterForm.get('paymentId').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.paymentId = value;
        console.log('paymentId = ', this.request.paymentId);
        this.getTransactions();
      });

    this.filterForm.get('sellPointId').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.sellPointId = value;
        console.log('sp = ', this.request.sellPointId);
        this.getTransactions();
      });

    this.filterForm.get('updatedAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.updatedAt = selectedDate;
        }
        else {
          this.request.updatedAt = '';
        }
        this.request.page = 1;
        this.getTransactions();
      });

    this.filterForm.get('createdAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.createdAt = selectedDate;
        }
        else {
          this.request.createdAt = '';
        }
        this.request.page = 1;
        this.getTransactions();
      });

    this.setDateMask();
  }

  getTwo(nbr): string {
    return (nbr <10)? '0' + nbr : '' + nbr;
  }

  getTransactions() {
    this.transactionService.getLazyTransactions(this.request).subscribe(
      (response) => {
        this.transactionResponse = response;
      }
    );
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.request.pageSize);
    this.pageChange(1);
  }
  pageChange($event) {
    this.request.page = $event;
    this.getTransactions();
  }

  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/aaaa'
    }).mask(this.createAtElem.nativeElement);
  }


  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['TRANSACTION']);
  }

  getSellPointList() {
    this.sellPointService.getAllSellPoints().subscribe((response) => {
      this.sellPointList = response;
    });
  }

  getStateList() {
    this.stateList = Object.keys(TransactionStatus)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => {return {id: TransactionStatus[key], label: TransactionStatus[key].toString()}});
  }

  getPaymentList() {
    this.paymentService.getPaymentList().subscribe((response) => {
      this.paymentList = response;
    });
  }
  openDetails(data) {
    const dialogRef = this.matDialog.open(TransactionModalComponent, {
      width: '450%',
      height: '90%',
      autoFocus: true,
      disableClose: false,
      data: {transaction: data}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
    });
  }

}
