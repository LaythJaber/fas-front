import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Client} from "../../shared/models/client";
import {ShopCartService} from "../../shared/services/shop-cart.service";
import {ShopCart} from "../../shared/models/shop-cart";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CartProductModalComponent} from "../../shared/compoenent/cart-product-modal/cart-product-modal.component";
import {ShopCartRow} from "../../shared/models/shop-cart-row";
import {SweetAlertService} from "../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-client-mgm-cart',
  templateUrl: './client-mgm-cart.component.html',
  styleUrls: ['./client-mgm-cart.component.scss']
})
export class ClientMgmCartComponent implements OnInit {

  @Input() client: Client;
  shopCart: ShopCart;

  constructor(
              private shopCartService: ShopCartService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.shopCartService.getShopCartByClient(this.client.clientId).subscribe(res => {
      this.shopCart = res;
      this.shopCartService.updateNumber(res.productsNumber);
    })
  }

  openProduct() {
    const dialogRef = this.matDialog.open(CartProductModalComponent, {
      width: '400%',
      height: '100%',
      autoFocus: true,
      disableClose: false,
      data: {clientId: this.client.clientId}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getCart();
    });
  }

  removeItem(row: ShopCartRow) {
    this.sweetAlertService
      .warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE'))
      .then(e => {
        if (e.value) {
          const index = this.shopCart.shopCartRowDtoList.findIndex(row1 => row1.productFDto.id === row.productFDto.id);
          if (index >= 0) {
            this.shopCart.shopCartRowDtoList.splice(index, 1);
            this.shopCartService.updateCart(this.shopCart).subscribe(response => {
              this.shopCart = response;
              this.shopCartService.updateNumber(response.productsNumber);
              this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
            })
          }
        }
      })
  }

  deleteCart() {
    this.sweetAlertService
      .warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE'))
      .then(e => {
        if (e.value) {
          this.shopCartService.deleteCart(this.shopCart.id).subscribe(response => {
            this.getCart();
            this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
          })
        }
      })
  }

}
