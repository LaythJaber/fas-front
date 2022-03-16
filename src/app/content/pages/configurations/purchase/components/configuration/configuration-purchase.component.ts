import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PurchaseConfigService} from "../../../../../../shared/services/purchase/purchase-config.service";
import {PurchaseConfiguration} from "../../../../../../shared/models/purchase/purchase-configuration";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BreadcrumbService} from "../../../../../../core/services/breadcrumb.service";

@Component({
  selector: 'app-configuration-purchase',
  templateUrl: './configuration-purchase.component.html',
  styleUrls: ['./configuration-purchase.component.scss']
})
export class ConfigurationPurchaseComponent implements OnInit {

  cancelTimeForm: FormGroup;
  conditionPageForm: FormGroup;
  pageList: {id: number, label: string}[] = [
    {id: 1, label: 'Pagina 1'},
    {id: 2, label: 'Pagina 2'},
    {id: 3, label: 'Pagina 3'},
  ];

  _purchaseConfiguration: PurchaseConfiguration;
  @Input()
  set purchaseConfiguration(value: PurchaseConfiguration) {
    this._purchaseConfiguration = value;
    if (this.purchaseConfiguration) {
      this.cancelTimeForm.get('cancelTime').patchValue(this.purchaseConfiguration.cancelTime);
      this.conditionPageForm.get('conditionPageNumber').patchValue(this.purchaseConfiguration.conditionPageNumber);
    }
  }

  get purchaseConfiguration() {
    return this._purchaseConfiguration;
  }

  constructor(
    private purchaseConfigService: PurchaseConfigService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'PURCHASE']);
    this.initForms();
  }

  ngOnInit() {
  }

  initForms() {
    this.cancelTimeForm = new FormGroup({
      cancelTime: new FormControl(null, Validators.required)
    });
    this.conditionPageForm = new FormGroup({
      conditionPageNumber: new FormControl(null, Validators.required)
    });
  }

  saveTime() {
    const cancelTime = this.cancelTimeForm.get('cancelTime').value;
    this.purchaseConfigService.updatePurchaseCancelTime(cancelTime).subscribe(
      () => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      });
  }

  saveConditionPage() {
    const conditionPageNumber = this.conditionPageForm.get('conditionPageNumber').value;
    this.purchaseConfigService.updatePurchaseConditionPage(conditionPageNumber).subscribe(
      () => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      });
  }


}
