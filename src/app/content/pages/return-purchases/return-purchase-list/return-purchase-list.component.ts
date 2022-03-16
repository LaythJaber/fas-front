import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import * as Inputmask from 'inputmask';
import {SearchResponse} from '../../../../shared/dto/search-response';
import {ReturnPurchasePageRequest} from '../../../../shared/models/return-product/return-purchase-page-request';
import {ReturnPurchase} from '../../../../shared/models/return-product/return-purchase';
import {PurchaseService} from '../../../../shared/services/purchase/purchase-service';
import {MatDialog} from '@angular/material/dialog';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {TranslateService} from '@ngx-translate/core';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {ReturnPurchaseService} from '../../../../shared/services/return-product/return-purchase.service';
import {ReturnPurchaseState} from '../../../../shared/models/return-product/return-purchase-state';
import {Purchase} from '../../../../shared/models/purchase/purchase';

@Component({
  selector: 'app-return-purchase-list',
  templateUrl: './return-purchase-list.component.html',
  styleUrls: ['./return-purchase-list.component.scss']
})
export class ReturnPurchaseListComponent implements OnInit {

  @ViewChild('createAtElem') createAtElem: ElementRef;

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.CLIENT',
    'DATA_TABLE.CODE_PURCHASE',
    'DATA_TABLE.STATUS',
    'DATA_TABLE.RETURN_PRODUCT',
    'DATA_TABLE.TOTAL_PURCHASE',
    'DATA_TABLE.TOTAL_RETURN',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.UPDATED',
  ];

  stateList: {id: string, label: string}[];

  filterForm: FormGroup;
  request: ReturnPurchasePageRequest;
  returnPurchaseResponse: SearchResponse<ReturnPurchase>;

  showMoreFilters = false;

  constructor(
    private purchaseService: PurchaseService,
    private matDialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private returnPurchaseService: ReturnPurchaseService
  ) {
  }

  ngOnInit() {
    this.sendBreadCrumb();
    this.getStateList();
    if (localStorage.getItem('returnPurchasesFilters')) {
      this.request = JSON.parse(localStorage.getItem('returnPurchasesFilters'));
    } else {
      this.initRequest();
    }
    this.initFilterForm();
    this.getReturnPurchases();
  }

  initRequest() {
    this.request = new ReturnPurchasePageRequest();
    this.request.page = 1;
    this.request.pageSize = 10;
    this.request.textSearch = '';
  }

  getReturnPurchases() {
    this.returnPurchaseService.getFilteredReturnPurchases(this.request).subscribe(
      (response) => {
        this.returnPurchaseResponse = response;
      }
    );
  }


  getStateList() {
    this.stateList = Object.keys(ReturnPurchaseState).map((key) => ({id: key, label: key}));
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'RETURN_PRODUCT']);
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      state: new FormControl(null),
      createdAt: new FormControl(null),
      updatedAt: new FormControl(null),
    });

    if (localStorage.getItem('returnPurchasesFilters')) {
      this.filterForm.patchValue(this.request);
    }

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        localStorage.setItem('returnPurchasesFilters', JSON.stringify(this.request));
        this.getReturnPurchases();
      });

    this.filterForm.get('state').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.state = value;
        localStorage.setItem('returnPurchasesFilters', JSON.stringify(this.request));
        this.getReturnPurchases();
      });

    this.filterForm.get('createdAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          this.request.createdAt = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
        } else {
          this.request.createdAt = '';
        }
        this.request.page = 1;
        localStorage.setItem('returnPurchasesFilters', JSON.stringify(this.request));
        this.getReturnPurchases();
      });

    this.filterForm.get('updatedAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          this.request.updatedAt = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
        } else {
          this.request.updatedAt = '';
        }
        this.request.page = 1;
        localStorage.setItem('returnPurchasesFilters', JSON.stringify(this.request));
        this.getReturnPurchases();
      });

    this.setDateMask();
  }

  getTwo(nbr): string {
    return (nbr < 10) ? '0' + nbr : '' + nbr;
  }

  pageChange($event) {
    this.request.page = $event;
    localStorage.setItem('returnPurchasesFilters', JSON.stringify(this.request));
    this.getReturnPurchases();
  }

  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/aaaa'
    }).mask(this.createAtElem.nativeElement);
  }

  goToReturnPurchaseDetails(returnPurchase: ReturnPurchase) {
    this.router.navigate(['/return-purchases/details', returnPurchase.id]);
  }

  goToPurchaseDetails($event, purchase: Purchase) {
    $event.stopPropagation();
    this.router.navigate(['/purchases/details', purchase.id]);
  }

  showHideMoreFilters() {
    this.showMoreFilters = !this.showMoreFilters;
  }

  resetFilter() {
    this.initRequest();
    localStorage.setItem('returnPurchasesFilters', JSON.stringify(this.request));
    this.initFilterForm();
    this.getReturnPurchases();
  }

}
