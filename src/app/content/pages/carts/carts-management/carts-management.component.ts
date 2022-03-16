import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CartPageRequest} from '../../../../shared/dto/cart-page-request';
import {SearchResponse} from '../../../../shared/dto/search-response';
import {ShopCart} from '../../../../shared/models/shop-cart';
import {MatDialog} from '@angular/material/dialog';
import {ShopCartService} from '../../../../shared/services/shop-cart.service';
import * as Inputmask from 'inputmask';
import {CartManagementModalComponent} from "./cart-management-modal/cart-management-modal.component";
import {debounceTime} from "rxjs/operators";
import {LocalStorageService} from 'ngx-webstorage';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-carts-management',
  templateUrl: './carts-management.component.html',
  styleUrls: ['./carts-management.component.scss']
})
export class CartsManagementComponent implements OnInit {
  @ViewChild('createAtElem') createAtElem: ElementRef;

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CLIENTE_CODE',
    'DATA_TABLE.CLIENTE',
    'DATA_TABLE.PRODUCT_NUMBER',
    'DATA_TABLE.TOTAL_NET',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.MODIFICATION_DATE'
  ];

  filterForm: FormGroup;
  request: CartPageRequest = new CartPageRequest();
  cartResponse: SearchResponse<ShopCart>;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(
    private shopCartService: ShopCartService,
    private matDialog: MatDialog,
    private breadcrumbService: BreadcrumbService,
    private localStorageService: LocalStorageService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.sendBreadCrumb();
    this.initFilterForm();
    this.request.page = 1;
    this.request.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.request.textSearch = '';
    this.getCarts();
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.request.pageSize);
    this.pageChange(1);
  }
  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      createdAt: new FormControl(null),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.getCarts();
      });

    this.filterForm.get('createdAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          console.log(selectedDate);
          this.request.createdAt = selectedDate;
        } else {
          this.request.createdAt = '';
        }
        this.request.page = 1;
        this.getCarts();
      });
    this.setDateMask();
  }

  getCarts() {
    this.shopCartService.searchCarts(this.request).subscribe(
      (response) => {
        this.cartResponse = response;
        console.log(this.cartResponse);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  pageChange($event) {
    this.request.page = $event;
    this.getCarts();
  }


  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/yyyy'
    }).mask(this.createAtElem.nativeElement);
  }

  getTwo(nbr): string {
    return (nbr < 10) ? '0' + nbr : '' + nbr;
  }

  showRows(data) {
    console.log(data);
    const dialogRef = this.matDialog.open(CartManagementModalComponent, {
      width: '450%',
      height: '95%',
      autoFocus: true,
      disableClose: false,
      data: {cart: data}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getCarts();
    });
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CART_MGM']);
  }

  deleteCart(id, event) {
    event.stopPropagation();
    this.sweetAlertService
      .warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE'))
      .then(e => {
        if (e.value) {
            this.shopCartService.deleteCart(id).subscribe(response => {
              this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
            })
        }
      })
  }


}
