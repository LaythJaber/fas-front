import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SearchResponse} from "../../../../shared/dto/search-response";
import {MatDialog} from "@angular/material/dialog";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {debounceTime} from "rxjs/operators";
import * as Inputmask from 'inputmask';
import {PurchasePageRequest} from "../../../../shared/models/purchase/purchase-page-request";
import {Purchase} from "../../../../shared/models/purchase/purchase";
import {PurchaseService} from "../../../../shared/services/purchase/purchase-service";
import {Router} from "@angular/router";
import {PurchaseState} from "../../../../shared/models/purchase/purchase-state";
import {Shipment} from "../../../../shared/models/shipment/shipment";
import {SellPoint} from "../../../../shared/models/sell-point";
import {ShipmentService} from "../../../../shared/services/shipment.service";
import {SellPointService} from "../../../../shared/services/sell-point.service";
import {Payment} from "../../../../shared/models/payment/payment";
import {PaymentService} from "../../../../shared/services/payment/payment.service";
import {PluginConfigService} from "../../../../shared/services/plugin/plugin-config.service";
import {PluginConfiguration} from "../../../../shared/models/plugin/plugin-configuration";
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {

  @ViewChild('createAtElem') createAtElem: ElementRef;

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.FULL_NAME',
    'DATA_TABLE.STATUS',
    'DATA_TABLE.SELL_POINTS',
    'DATA_TABLE.SHIPMENT',
    'DATA_TABLE.PAYMENT',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.UPDATED',
  ];



  pluginConfiguration: PluginConfiguration;

  filterForm: FormGroup;
  request: PurchasePageRequest = new PurchasePageRequest();
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  purchaseResponse: SearchResponse<Purchase>;

  stateList: {id: string, label: string }[];
  shipmentList: Shipment[] = [];
  sellPointList: SellPoint[] = [];
  paymentList: Payment[] = [];

  showMoreFilters: boolean = false;

  constructor(
    private purchaseService: PurchaseService,
    private matDialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private shipmentService: ShipmentService,
    private sellPointService: SellPointService,
    private paymentService: PaymentService,
    private localStorageService: LocalStorageService,
    private pluginConfigService: PluginConfigService
  ) {
    this.getPluginConfigurationDetails();
  }

  ngOnInit() {
    this.sendBreadCrumb();
    this.getStateList();
    if (localStorage.getItem('purchasesFilters')) {
      this.request = JSON.parse(localStorage.getItem('purchasesFilters'));
    }
    else {
      this.initRequest();
    }
    this.initFilterForm();
    this.getPurchases();
    this.getSellPointList();
    this.getShipmentList();
    this.getPaymentList();
  }

  initRequest() {
    this.request = new PurchasePageRequest();
    this.request.page = 1;
    this.request.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.request.textSearch = '';
    this.getPurchases();
    this.getStateList();
    this.getSellPointList();
    this.getShipmentList();
    this.getPaymentList();
  }

  getPluginConfigurationDetails() {
    this.pluginConfigService.getPluginConfiguration().subscribe((response) => {
      this.pluginConfiguration = response;
    });
  }

  getStateList() {
    this.stateList = Object.keys(PurchaseState)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => {return {id: PurchaseState[key], label: PurchaseState[key].toString()}});
  }

  getShipmentList() {
    this.shipmentService.getAllShipmentList().subscribe((response) => {
      this.shipmentList = response;
    })
  }

  getSellPointList() {
    this.sellPointService.getAllSellPoints().subscribe((response) => {
      this.sellPointList = response;
    });
  }

  getPaymentList() {
    this.paymentService.getPaymentList().subscribe((response) => {
      this.paymentList = response;
    });
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['PURCHASE']);
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      state: new FormControl(null),
      sellPointId: new FormControl(null),
      shipmentId: new FormControl(null),
      createdAt: new FormControl(null),
      updatedAt: new FormControl(null),
      paymentId: new FormControl(null),
    });

    if (localStorage.getItem('purchasesFilters')) {
      this.filterForm.patchValue(this.request);
    }

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
        this.getPurchases();
      });

    this.filterForm.get('state').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.state = value;
        localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
        this.getPurchases();
      });

    this.filterForm.get('sellPointId').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.sellPointId = value;
        localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
        this.getPurchases();
      });

    this.filterForm.get('shipmentId').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.shipmentId = value;
        localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
        this.getPurchases();
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
        localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
        this.getPurchases();
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
        localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
        this.getPurchases();
      });

    this.filterForm.get('paymentId').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.paymentId = value;
        localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
        this.getPurchases();
      });

    this.setDateMask();
  }

  getTwo(nbr): string {
    return (nbr <10)? '0' + nbr : '' + nbr;
  }

  getPurchases() {
    this.purchaseService.getLazyPurchases(this.request).subscribe(
      (response) => {
        this.purchaseResponse = response;
      }
    );
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.request.pageSize);
    this.pageChange(1);
  }
  pageChange($event) {
    this.request.page = $event;
    localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
    this.getPurchases();
  }

  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/aaaa'
    }).mask(this.createAtElem.nativeElement);
  }

  goToPurchaseDetails(purchase: Purchase) {
    this.router.navigate(['/purchases/details', purchase.id]);
  }


  showHideMoreFilters() {
    this.showMoreFilters = !this.showMoreFilters;
  }

  resetFilter() {
    this.initRequest();
    localStorage.setItem('purchasesFilters', JSON.stringify(this.request));
    this.initFilterForm();
    this.getPurchases();
  }

}
