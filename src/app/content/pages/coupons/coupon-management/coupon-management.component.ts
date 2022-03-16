import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CouponService} from '../../../../shared/services/coupon.service';
import {CouponPageRequest} from '../../../../shared/dto/couponPageRequest';
import {SearchResponse} from '../../../../shared/dto/search-response';
import {Coupon} from '../../../../shared/models/coupon';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime} from 'rxjs/operators';
import {CouponType} from '../../../../shared/enum/coupon-type';
import * as Inputmask from 'inputmask';
import {CouponConditionType} from '../../../../shared/enum/couponCondition-Type';
import {PromotionType} from '../../../../shared/enum/promotion-type';
import {MessageService} from '../../../../shared/services/message.service';
import {Router} from '@angular/router';
// @ts-ignore
import {DiscountType} from '../../../../shared/enum/discount-type';
import {Product} from '../../../../shared/models/product';
import {MatSnackBar} from '@angular/material';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-coupon-management',
  templateUrl: './coupon-management.component.html',
  styleUrls: ['./coupon-management.component.scss']
})
export class CouponManagementComponent implements OnInit {
  @ViewChild('dateFromElem') dateFromElem: ElementRef;
  @ViewChild('dateToElem') dateToElem: ElementRef;

  columns_1 = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
  ]

  columns_2 = [
    'DATA_TABLE.DESCRIPTION',
    'COUPON.PROMO',
    'COUPON.START_DATE',
    'COUPON.END_DATE',
    'COUPON.TYPE',
    'COUPON.DISCOUNTTYPE',
  ];

  columns_3 = [
    'COUPON.DISCOUNT',
    'COUPON.MINPDTQTY',
    'COUPON.MINAMOUNTORDER',
    'COUPON.MAX_NUMBER_USE',
  ];

  columns_4 = [
    'COUPON.ACTUAL_NUMBER_USE',
    'COUPON.PROMOTIONTYPE',
    'COUPON.CONDITIONTYPE',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.UPDATED',

  ];

  filterForm: FormGroup;
  request: CouponPageRequest = new CouponPageRequest();
  couponResponse: SearchResponse<Coupon>;
  showFilter = false;
  types = [];
  conditionTypes = [];
  promotionTypes = [];
  discountTypes = [];
  orderType = 'DESC';
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(private couponService: CouponService,
              private translate: TranslateService,
              private localStorageService: LocalStorageService,
              private messageService: MessageService, private breadcrumbService: BreadcrumbService,
              private router: Router, private sweetAlertService: SweetAlertService) { }

  ngOnInit() {
    this.initFilterForm();
    this.sendBreadCrumb();
    this.request.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.request.page = 1;
    this.request.textSearch = '';
    this.request.dateFrom = '';
    this.request.dateTo = '';
    this.getCoupons();
  }


  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['COUPON', 'LIST_COUPONS']);
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      couponType: new FormControl(null),
      couponConditionType: new FormControl(null),
      promotionType: new FormControl(null),
      discountType: new FormControl(null)
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.getCoupons();
      });

    this.filterForm.get('couponType').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
          this.request.couponType = value;
          this.getCoupons();
      });

    this.filterForm.get('dateFrom').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
           this.request.dateFrom = selectedDate;
        } else {
          this.request.dateFrom = '';
        }
        this.request.page = 1;
        this.getCoupons();
      });

    this.filterForm.get('dateTo').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.dateTo = selectedDate;
        } else {
          this.request.dateTo = '';
        }
        this.request.page = 1;
        this.getCoupons();
      });

    this.filterForm.get('couponConditionType').valueChanges.subscribe(value => {
      this.request.page = 1;
      this.request.couponConditionType = value;
      this.getCoupons();
      });

    this.filterForm.get('promotionType').valueChanges.subscribe(value => {
      this.request.page = 1;
      this.request.promotionType = value;
      this.getCoupons();
    });

   // this.setDateFromMask();
   // this.setDateToMask();
  }


  getTwo(nbr): string {
    return (nbr < 10) ? '0' + nbr : '' + nbr;
  }

  getCoupons() {
    this.couponService.getCoupons(this.request).subscribe(
      (response) => {
        this.couponResponse = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.request.pageSize);
    this.pageChange(1);
  }
  pageChange(page: number) {
    this.request.page = page;
    this.getCoupons();
  }

  setDateFromMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/yyyy'
    }).mask(this.dateFromElem.nativeElement);
  }

  setDateToMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/yyyy'
    }).mask(this.dateToElem.nativeElement);
  }


  resetFilter() {
    this.filterForm.reset();
    this.request.page = 1;
    this.getCoupons();
  }

  showHideFilter() {
    this.showFilter = !this.showFilter;
  }

  translateTypes() {
       this.types = Object.keys(CouponType)
        .filter(value => isNaN(Number(value)) === false)
        .map((key) => ({label: this.translate.instant('COUPON.' + CouponType[key]), value: CouponType[key].toString()}) );
     }

  translateConditionTypes() {
    this.conditionTypes = Object.keys(CouponConditionType)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => ({label: this.translate.instant('COUPON.' + CouponConditionType[key]), value: CouponConditionType[key].toString()}) );

  }

  translatePromotionTypes() {
     this.promotionTypes = Object.keys(PromotionType)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => ({label: this.translate.instant('COUPON.' + PromotionType[key]), value: PromotionType[key].toString()}) );
   }

  translateDiscountTypes() {
    this.discountTypes = Object.keys(DiscountType)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => ({label: this.translate.instant('COUPON.' + DiscountType[key]), value: DiscountType[key].toString()}) );
  }

  addNewCoupon() {
    this.sendMessage(false, null);
    this.router.navigate(['/coupon-mgm/new-coupon']);
  }

  sendMessage(mode: boolean, obj: any): void {
    this.messageService.sendMessage([mode, obj]);
  }

  clearMessages(): void {
    this.messageService.clearMessages();
  }


  editCoupon(d) {
    this.sendMessage(true, d);
    this.router.navigate(['/coupon-mgm/update-coupon']);
  }


  deleteCoupon($event, c1: Coupon){
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + ' ' + c1.couponId)
      .then(res => {
        if (res.value) {
          this.couponService.deleteCoupon(c1.couponId).subscribe(r => {
              this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
              this.getCoupons();

              }, err => {
              console.log('failed delete coupon error = ', err);
              this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_DELETE'));
            });
        };
   });
  }

  filterCoupon(sort?) {
    this.request.page = 1;
    this.request.sort = sort;
    this.getCoupons();
  }

  sortRows(c: string) {
    if (this.orderType === 'ASC') {
      this.orderType = 'DESC';
    } else {
      this.orderType = 'ASC';
    }
    const sort = c.substr(c.indexOf( '.' ) + 1, c.length);
    console.log('soooooort', this.orderType);
    switch (sort) {
      case 'ID':
        this.filterCoupon({
          attribute: 'couponId',
          direction: this.orderType
        });
        break;

      case 'CODE':
        this.filterCoupon({
          attribute: 'code',
          direction: this.orderType
        });
        break;

      case 'DISCOUNT':
        this.filterCoupon({
          attribute: 'discount',
          direction: this.orderType
        });
        break;

      case 'MINPDTQTY':
        this.filterCoupon({
          attribute: 'minProductQuantity',
          direction: this.orderType
        });
        break;

      case 'MINAMOUNTORDER':
        this.filterCoupon({
          attribute: 'minAmountOrder',
          direction: this.orderType
        });
        break;


      case 'MAX_NUMBER_USE':
        this.filterCoupon({
          attribute: 'maxNumberUse',
          direction: this.orderType
        });
        break;

      // case 'ACTUAL_NUMBER_USE':
      //   this.filterCoupon({
      //                       attribute: 'actualNumberUse',
      //                       direction: this.orderType
      //   });
      // break;

  }}

  getCouponUsed(coupon: Coupon) {
     return coupon.clients.map(e => e.actualNumberUse)
      .reduce((a, b) => a + b, 0);

  }
}
