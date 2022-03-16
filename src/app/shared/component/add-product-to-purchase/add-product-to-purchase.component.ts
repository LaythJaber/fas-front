import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PriceService} from "../../services/price-service";
import {Product} from "../../models/product";
import {CartRequest} from "../../dto/cart-request";
import {PurchaseService} from "../../services/purchase/purchase-service";
import {Purchase} from "../../models/purchase/purchase";
import {PurchaseRow} from "../../models/purchase/purchase-row";

@Component({
  selector: 'app-add-product-to-purchase',
  templateUrl: './add-product-to-purchase.component.html',
  styleUrls: ['./add-product-to-purchase.component.scss']
})
export class AddProductToPurchaseComponent implements OnInit {

  purchase: Purchase;
  row: PurchaseRow;
  addProductForm: FormGroup;
  product: Product;

  constructor(
    public dialogRef: MatDialogRef<AddProductToPurchaseComponent>,
    public priceService: PriceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private purchaseService: PurchaseService
  ) {
    this.product = this.data.product;
    this.purchase = this.data.purchase;
    this.row = this.data.row;
  }

  ngOnInit() {
    this.initAddProductForm();
  }

  initAddProductForm() {
    this.addProductForm = new FormGroup({
      quantity: new FormControl(null, Validators.required),
      unit: new FormControl(null),
      colorId: new FormControl(null),
      sizeId: new FormControl(null)
    });
    this.addProductForm.get('unit').setValue(this.product.weighted ? this.product.weightUm : 'pz');
    let qte = this.row ? this.row.quantityOrdered :  null;
    if (qte && this.row.weighted) {
      qte = Math.round(qte * this.row.weight);
    }
    this.addProductForm.get('quantity').setValue(qte);
    this.addProductForm.get('colorId').setValue(this.row ? this.row.colorId :  null);
    this.addProductForm.get('sizeId').setValue(this.row ? this.row.sizeId :  null);
  }

  addProduct() {
    let quantity = this.addProductForm.get('quantity').value;
    if (this.product.weighted) {
      quantity = quantity / this.product.weight;
    }
    const colorId = this.addProductForm.get('colorId').value;
    const sizeId = this.addProductForm.get('sizeId').value;
    console.log('start adding ... ');
    let request: CartRequest = {
      productId: this.product.id,
      quantity: quantity,
      colorId: colorId,
      sizeId: sizeId,
      purchaseRowId: this.row ? this.row.id : null
    }
    console.log('request  = ', request);
    this.purchaseService.addProductToPurchase(this.purchase.id, request).subscribe(result => {
      console.log("add product result = ", result);
      this.dialogRef.close(result);
    });
  }

}
