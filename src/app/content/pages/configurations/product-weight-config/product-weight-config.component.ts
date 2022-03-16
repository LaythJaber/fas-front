import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ProductWeightConfigurationService} from "../../../../shared/services/product/product-weight-configuration.service";
import {ProductWeightConfiguration} from "../../../../shared/models/product/product-weight-configuration";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-product-weight-config',
  templateUrl: './product-weight-config.component.html',
  styleUrls: ['./product-weight-config.component.scss']
})
export class ProductWeightConfigComponent implements OnInit {

  productWeightConfigForm: FormGroup;
  productWeightConfiguration: ProductWeightConfiguration

  constructor(
    private productWeightConfigurationService: ProductWeightConfigurationService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.initForms();
  }

  ngOnInit() {
    this.getProductWeightConfigurationDetails();
  }

  initForms() {
    this.productWeightConfigForm = new FormGroup({
      id: new FormControl(null),
      displayWeightInAddButton: new FormControl(false)
    });
  }

  getProductWeightConfigurationDetails() {
    this.productWeightConfigurationService.getProductWeightConfigurationDetails().catch((response) => {
        console.log('product weight config = ', response);
        this.productWeightConfiguration = response;
        this.productWeightConfigForm.patchValue(this.productWeightConfiguration);
      });
  }


  update() {
    this.productWeightConfigurationService.updateProductWeightConfiguration(this.productWeightConfigForm.getRawValue())
      .subscribe((response) => {
        console.log('update config = ', response);
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getProductWeightConfigurationDetails();
      }, () => {this.snackBar.open(this.translate.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});});
  }

}
