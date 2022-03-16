import {Component, Injector, OnInit} from '@angular/core';
import {Product} from '../../../../../../shared/models/product';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {GoogleProduct, SaleAppProductAvailability} from '../../../../../../shared/models/sale-app/google/google-product';
import {SaleApp} from '../../../../../../shared/models/sale-app/sale-app';
import * as moment from 'moment';
import {ProductMgmService} from '../../../../../../shared/services/product-mgm.service';
import {GoogleMerchantService} from '../../../../../../shared/services/sale-app/google-merchant.service';
import {BreadcrumbService} from '../../../../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-product-mgm',
  templateUrl: './product-mgm.component.html',
  styleUrls: ['./product-mgm.component.scss']
})
export class ProductMgmComponent implements OnInit {

  productForm: FormGroup;
  product: Product;
  googleProduct: GoogleProduct;
  saleApp: SaleApp;
  editMode = false;
  inLoading = false;

  availabilityList: {id: string, label: string }[];

  dialogRef: any;
  data: any;

  constructor(
    private injector: Injector,
    private googleMerchantService: GoogleMerchantService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private productService: ProductMgmService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.data = this.injector.get(MAT_DIALOG_DATA, null);
    this.saleApp = this.data.saleApp;
    this.editMode = this.data.editMode;
    if (this.editMode) {
      this.googleProduct = this.data.product;
      this.getProductDetails(this.googleProduct.offerId);
    } else {
      this.product = this.data.product;
      this.getProductDetails(this.data.product.id);
    }
  }

  ngOnInit() {
    this.initAddProductForm();
    this.getAvailabilityList();
  }

  getProductDetails(productId) {
    this.productService.getById(productId).subscribe((response) => {
      this.product = response;
      if (!this.editMode) {
        if (this.product.stock <= 0) {
          this.productForm.get('availability').patchValue('out of stock');
          this.setAvailability();
        }
      }
    });
  }


  initAddProductForm() {
    this.productForm = new FormGroup({
      availability: new FormControl('in stock', Validators.required),
      availabilityDate: new FormControl(null),
      expirationDate: new FormControl(null),
      sellOnGoogleQuantity: new FormControl(null)
    });
    if (this.data.editMode) {
      this.productForm.patchValue(this.googleProduct);
    }
    this.setAvailability();
  }

  getAvailabilityList() {
    this.availabilityList = Object.keys(SaleAppProductAvailability)
      .map((key) => ({id: SaleAppProductAvailability[key], label: key}));
  }

  setAvailability() {
    const availability = this.productForm.get('availability').value;
    if (availability === 'preorder' || availability === 'backorder') {
      this.productForm.get('availabilityDate').enable();
    } else {
      this.productForm.get('availabilityDate').setValue(null);
      this.productForm.get('availabilityDate').disable();
    }
    if (availability === 'in stock') {
      this.productForm.get('sellOnGoogleQuantity').enable();
    } else {
      this.productForm.get('sellOnGoogleQuantity').disable();
    }
  }


  saveProduct(product) {
    this.inLoading = true;
    const availability = this.productForm.get('availability').value;
    const sellOnGoogleQuantity = this.productForm.get('sellOnGoogleQuantity').value;
    const ad = this.productForm.get('availabilityDate').value;
    const availabilityDate = ad ?  moment(ad).format() : '';

    const ed = this.productForm.get('expirationDate').value;
    const expirationDate = ed ? moment(ed).format() : '';

    let googleProduct;
    if (!this.editMode) {
      googleProduct = this.googleMerchantService.mapProductToSaleAppProduct(product, this.saleApp.googleMerchantDomain,
                      availability, availabilityDate, expirationDate, sellOnGoogleQuantity);
    } else {
      googleProduct = this.googleMerchantService.updateSaleAppProduct(product, availability,
                      availabilityDate, expirationDate, sellOnGoogleQuantity);
    }

    console.log('googleProduct to add/update = ', googleProduct);

    this.googleMerchantService.addProduct(this.saleApp.googleMerchantUserId, googleProduct)
      .subscribe(() => {
        this.inLoading = false;
        this.dialogRef.close(true);
        if (!this.editMode) {
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000});
        } else {
          this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        }
      }, () => {
        this.inLoading = false;
        if (!this.editMode) {
          this.snackBar.open(this.translate.instant('DIALOG.CANNOT_ADD'), 'Ok', {duration: 5000});
        } else {
          this.snackBar.open(this.translate.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
        }
      });
  }


}
