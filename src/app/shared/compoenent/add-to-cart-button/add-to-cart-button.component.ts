import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProductType, Variation } from '../../models/product';
import { ShopCart } from '../../models/shop-cart';
import { ShopCartRow } from '../../models/shop-cart-row';
import { ClientMgmService } from '../../services/client-mgm.service';
import { PriceService } from '../../services/price-service';
import { ProductWeightConfigurationService } from '../../services/product/product-weight-configuration.service';
import { ShopCartService } from '../../services/shop-cart.service';

@Component({
  selector: 'app-add-to-cart-button',
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.scss']
})
export class AddToCartButtonComponent implements OnInit {
  cartButtonForm: FormGroup;

  @Input() cart: ShopCart;
  @Input() productId: number;
  @Input() productType: ProductType;
  @Input() disabled = false;
  @Input() colors: Variation[] = [];
  @Input() sizesSchemas: Variation[] = [];
  @Input() shopCartRow: ShopCartRow;

  // color variation
  _colorId: number;
  @Input()
  set colorId(value: number) {
    this._colorId = value;
  }

  get colorId() {
    return this._colorId;
  }

  // size variation
  _sizeId: number;
  @Input()
  set sizeId(value: number) { 
    this._sizeId = value;
  }
  get sizeId() {
    return this._sizeId;
  }

  @Input() clicked = true;
  @Output() qte = new EventEmitter<number>();

  @Output() shopCart = new EventEmitter<number>();

  //shopCart: ShopCart;
  //shopCartRow: ShopCartRow;

  checked = false;
  focused = false;

  timerPlus = null;
  nbrPlusClicks = 0;

  timerMinus = null;
  nbrMinusClicks = 0;

  displayWeightInAddButton = false;

  constructor(
      public shopCartService: ShopCartService,
      public productWeightConfigurationService: ProductWeightConfigurationService,
      public priceService: PriceService,
      private clientService: ClientMgmService,
      private toastrService: ToastrService,
      private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.initForms();
    this.controlShopCart();
    this.controlProductWeightConfig();
  }

  initForms() {
    this.cartButtonForm = new FormGroup({
      quantity: new FormControl(0),
      quantityText: new FormControl(0),
    });
  }

  controlShopCart() {
      this.findProduct();
      this.checked = false;
  }

  controlProductWeightConfig() {
    this.productWeightConfigurationService.productWeightConfiguration$.subscribe((config) => {
      if (config) {
        this.displayWeightInAddButton = config.displayWeightInAddButton;
      }
    });
  }

  onBlur($event) {
    setTimeout(() => {
      this.focused = false;
      setTimeout(() => {
        this.resetQuantity();
      });
    }, 500);
  }

  onFocusIn($event) {
    this.focused = true;
    this.cartButtonForm.get('quantityText').patchValue(this.shopCartRow.productFDto.weight * this.shopCartRow.quantity);
  }

  onFocusOut($event) {
    setTimeout(() => {
      this.focused = false;
    }, 300);
  }

  resetQuantity() {
    this.cartButtonForm.get('quantity').patchValue(this.shopCartRow.quantity);
    this.cartButtonForm.get('quantityText').patchValue(this.priceService.
    getWeightQuantity(this.shopCartRow.productFDto, this.shopCartRow.quantity));
  }

  saveQuantity() {
    let qf: number;
    if (this.shopCartRow.productFDto.weighted && this.displayWeightInAddButton) {
      qf = this.cartButtonForm.get('quantityText').value;
    }
    else {
      qf = this.cartButtonForm.get('quantity').value;
    }

    if (this.shopCartRow.productFDto.weighted) {
      qf = Math.round(qf / this.shopCartRow.productFDto.weight);
      console.log('qf = ', qf);
    }

    const qr = this.shopCartRow.quantity;
    if (qf - qr > 0) {
     this.shopCartService.incQuantity(this.productId, this.cart, this.colorId, this.sizeId, qf - qr).subscribe(r=>{
       this.shopCart.emit(r);
     });
    }
    if (qf - qr < 0) {
      this.shopCartService.decQuantity(this.productId, this.cart, this.colorId, this.sizeId, qr - qf).subscribe(r=>{
        this.shopCart.emit(r);
      });;
    }
  }

  findProduct() {
    console.log(this.shopCartRow);
    const qte = this.shopCartRow.quantity;
    this.cartButtonForm.get('quantity').patchValue(qte);
    this.cartButtonForm.get('quantityText').patchValue(this.priceService.getWeightQuantity(this.shopCartRow.productFDto, qte));
    this.qte.emit(qte);
    this.clicked = true;
  }

  add() {
    this.clientService.getClientById(this.cart.clientId).subscribe((u) => {
      if (u) {
        if (this.productType === ProductType.FASHION) {
          if (this.colors?.length && !this.colorId) {
            this.toastrService.info(this.translate.instant('messages.select-size'));
            return;
          }
          if (this.sizesSchemas?.length && !this.sizeId) {
            this.toastrService.info(this.translate.instant('select-size'));
            return;
          }
        }
        this.checked = true;
        this.incQuantity();
      }
     /* else {
        this.navService.goToLoginPage();
      }*/
    });
  }


  incQuantity() {
    this.nbrPlusClicks++;

    // first click
    if (this.nbrPlusClicks === 1) {
      if (this.shopCartRow) {
        this.shopCartRow.quantity++;
        this.qte.emit(this.shopCartRow.quantity);
      }
      this.setTimerPlus(1);
    }

    // other successive clicks
    if (this.nbrPlusClicks > 1) {
      if (this.timerPlus !== null) {// last timer in progresss
        if (this.shopCartRow) {
          this.shopCartRow.quantity++;
          this.qte.emit(this.shopCartRow.quantity);
        }
        clearTimeout(this.timerPlus);
        this.setTimerPlus(this.nbrPlusClicks);
      }
    }
  }

  setTimerPlus(nbrc) {
    this.timerPlus = setTimeout(() => {
      this.shopCartService.incQuantity(this.productId, this.cart, this.colorId, this.sizeId, nbrc).subscribe(r=>{
        this.shopCart.emit(r);
      });
      this.nbrPlusClicks = 0;
      this.timerPlus = null;
    }, 500);
  }

  decQuantity() {
    this.nbrMinusClicks++;

    // first click
    if (this.nbrMinusClicks === 1) {
      if (this.shopCartRow) {
        this.shopCartRow.quantity--;
        if (this.shopCartRow.quantity <= 0) {
          this.clicked = false;
          this.shopCartRow.quantity = 0;
        }
        this.qte.emit(this.shopCartRow.quantity);
      }
      this.setTimerMinus(1);
    }

    // other successive clicks
    if (this.nbrMinusClicks > 1) {
      if (this.timerMinus !== null) {// last timer in progresss
        if (this.shopCartRow) {
          this.shopCartRow.quantity--;
          if (this.shopCartRow.quantity <= 0) {
            this.clicked = false;
            this.shopCartRow.quantity = 0;
          }
          this.qte.emit(this.shopCartRow.quantity);
        }
        clearTimeout(this.timerMinus);
        this.setTimerMinus(this.nbrMinusClicks);
      }
    }
  }

  setTimerMinus(nbrc) {
    this.timerMinus = setTimeout(() => {
      this.shopCartService.decQuantity(this.productId, this.cart, this.colorId, this.sizeId, nbrc).subscribe(r=>{
        this.shopCart.emit(r);
      });
      this.nbrMinusClicks = 0;
      this.timerMinus = null;
    }, 500);
  }

}