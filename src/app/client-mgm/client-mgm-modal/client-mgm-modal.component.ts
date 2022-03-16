import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ClientMgmService} from "../../shared/services/client-mgm.service";
import {ShopCartService} from "../../shared/services/shop-cart.service";

@Component({
  selector: 'app-client-mgm-modal',
  templateUrl: './client-mgm-modal.component.html',
  styleUrls: ['./client-mgm-modal.component.scss']
})
export class ClientMgmModalComponent implements OnInit {

  editMode;
  client: any;
  wishNumber: number = 0;
  productsNumber: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ClientMgmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientMgmService,
    private shopCartService: ShopCartService,
  ) {
    this.client = this.data.client;
    this.editMode = this.data.editMode;
  }

  ngOnInit() {
    this.getWishListNumber();
    this.getCartProductsNumber();
  }

  savedClient(event) {
    this.client = event;
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  getWishListNumber() {
    if (this.editMode) {
      this.clientService.getWishListByClient({page: 1, pageSize: 1}, this.client.clientId)
        .then((response) => {
          this.wishNumber = response.totalRecords;
        });
    }
  }

  getCartProductsNumber() {
    if (this.editMode) {
      this.shopCartService.getShopCartByClient(this.client.clientId).subscribe(res => {
        this.shopCartService.updateNumber(res.productsNumber);
      })
      this.shopCartService.productsNumber.subscribe(result => {
        this.productsNumber = result;
      })
    }
  }

}
