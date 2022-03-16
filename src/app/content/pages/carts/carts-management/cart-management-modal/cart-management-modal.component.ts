import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ShopCartService } from "../../../../../shared/services/shop-cart.service";
import { ShopCartRow } from "../../../../../shared/models/shop-cart-row";
import { ShopCart } from "../../../../../shared/models/shop-cart";
import { SweetAlertService } from "../../../../../shared/services/sweet-alert.service";
import { TranslateService } from "@ngx-translate/core";
import { CartProductModalComponent } from "../../../../../shared/compoenent/cart-product-modal/cart-product-modal.component";
import { PriceService } from "../../../../../shared/services/price-service";
import { CartConfigurationService } from 'src/app/shared/services/cart-configuration.service';
import { CartConfiguration } from 'src/app/shared/models/cart/cart-configuration';

@Component({
  selector: 'app-cart-management-modal',
  templateUrl: './cart-management-modal.component.html',
  styleUrls: ['./cart-management-modal.component.scss']
})
export class CartManagementModalComponent implements OnInit {

  cart: ShopCart;
  cartRows: ShopCartRow[];
  public cartConfig: CartConfiguration;
  constructor(
    public dialogRef: MatDialogRef<CartManagementModalComponent>,
    public priceService: PriceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private shopCartService: ShopCartService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    public cartConfigurationService: CartConfigurationService,
  ) {
    this.cart = this.data.cart;
  }

  ngOnInit() {
    this.findRows();

    this.getCartConfiguration();
  }

  findRows() {
    this.shopCartService.findRows(this.cart.id).subscribe(rows => {
      this.cartRows = rows;
      this.cart.shopCartRowDtoList = rows;
    })
  }

  getCartConfiguration() {
    this.cartConfigurationService.getCartConfiguration().subscribe(res => {
      this.cartConfig = res;
    })
  }

  close() {
    this.dialogRef.close();
  }

  openProduct(data) {
    const dialogRef = this.matDialog.open(CartProductModalComponent, {
      width: '450%',
      height: '95%',
      autoFocus: true,
      disableClose: false,
      data: { clientId: data }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.shopCartService.getShopCartByClient(this.cart.clientId).subscribe(response => {
        this.cart = response;
        this.findRows();
      })
    });
  }

  removeItem(row: ShopCartRow) {
    this.sweetAlertService
      .warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE'))
      .then(e => {
        if (e.value) {
          const index = this.cartRows.findIndex(row1 => row1.productFDto.id === row.productFDto.id
            && row1.colorId === row.colorId && row1.sizeId === row.sizeId);
          if (index >= 0) {
            this.cartRows.splice(index, 1);
            this.cart.shopCartRowDtoList = this.cartRows;
            this.shopCartService.updateCart(this.cart).subscribe(response => {
              this.cart = response;
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
          this.shopCartService.deleteCart(this.cart.id).subscribe(response => {
            this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
            this.close();
          })
        }
      })
  }

  toggleRowReplaceable($event, row: ShopCartRow) {
    this.shopCartService.toggleRowReplaceable(row.id, $event.checked, this.cart.clientId).subscribe(() => { });
  }


  newRow(newCart) {
    console.log(newCart);
    this.cart = newCart;
    //this.cart.shopCartRowDtoList = this.cartRows;
    this.shopCartService.updateCart(this.cart).subscribe(response => {
      console.group(response);
      this.cart = response;
      this.cartRows=this.cart.shopCartRowDtoList;
    })
  }

}
