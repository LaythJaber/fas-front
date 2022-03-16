import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OperatorMgmFormDialogComponent } from './operator-mgm-form-dialog/operator-mgm-form-dialog.component';
import { OperatorMgmService } from '../../../../../shared/services/operator-mgm.service';
import { SellPoint } from '../../../../../shared/models/sell-point';
import { Operator } from '../../../../../shared/models/operator';
import { TranslateService } from '@ngx-translate/core';
import { SweetAlertService } from '../../../../../shared/services/sweet-alert.service';
import { ProductBarcodeType } from '../../../../../shared/enum/product-barcode-type';
import { LicenseConfigurationService } from '../../../../../shared/services/license-configuration.service';

@Component({
  selector: 'app-user-mgm-dialog',
  templateUrl: './operator-mgm.component.html',
  styleUrls: ['./operator-mgm.component.scss']
})
export class OperatorMgmComponent implements OnInit {
  columns = [
    '',
    'DATA_TABLE.USERNAME',
    'DATA_TABLE.FIRST_NAME',
    'DATA_TABLE.LAST_NAME',
    'DATA_TABLE.MOBILE',
    'DATA_TABLE.ROLE',
    'DATA_TABLE.SELL_POINTS'
  ];
  operatorList: { account: Operator, sellPoints: SellPoint[] }[] = [];
  loading = false;
  private selectedType: any;
  types = [];
  dialogRef: any;
  maxOperators: number;
  countOperators: number;

  constructor(
    private matDialog: MatDialog,
    private translate: TranslateService,
    private sweetAlertService: SweetAlertService,
    private operatorService: OperatorMgmService,
    private licenseService: LicenseConfigurationService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.operatorService.getAllOperators().subscribe(d => {
      this.operatorList = d;
      this.loading = false;
    });
    this.licenseService.getCurrentGroupMaxOperators().subscribe(d => {
      this.maxOperators = d.maxOperators;
      this.countOperators = d.countOperators;
    });
  }

  addNewOperator() {
    const dialogRef = this.matDialog.open(OperatorMgmFormDialogComponent, {
      width: '1200px',
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(v => {
      if (v) {
        this.loading = true;
        this.operatorService.getAllOperators().subscribe(d => {
          this.operatorList = d;
          this.loading = false;
        });
      }
    });
  }

  editOperator(operatorSellPoint) {
    const dialogRef = this.matDialog.open(OperatorMgmFormDialogComponent, {
      width: '1200px',
      disableClose: true,
      data: {editMode: true, operator: operatorSellPoint.account, sellPoints: operatorSellPoint.sellPoints}
    });
    dialogRef.afterClosed().subscribe(v => {
      if (v) {
        this.loading = true;
        this.operatorService.getAllOperators().subscribe(d => {
          this.operatorList = d;
          this.loading = false;
        });
      }
    });
  }

  printOperatorEan(op, content) {
    if (!op.account.barCode) {
      this.sweetAlertService.danger(this.translate.instant('DIALOG.NO_EAN_FOR_THIS_OPERATOR'));
      return;
    }
    this.dialogRef = this.matDialog.open(content, {minWidth: 400});
    this.dialogRef.afterClosed().subscribe(d => {
      const request = {
        description: op.account.firstName + ' ' + op.account.lastName,
        barCode: op.account.barCode,
        ticketQuantity: 1,
        type: this.selectedType,
      };
      this.operatorService.printEan(request).subscribe(data => {
        const downloadUrl = window.URL.createObjectURL(data.body);
        window.open(downloadUrl);
      }, error => {
        this.sweetAlertService.notification(this.translate.instant('PAYMENT.PRINT_FAILED'));
      });
    });
  }

  translateTypes() {
    this.types = [
      {description: this.translate.instant('PRODUCT_FORM.' + ProductBarcodeType.CONTINUOUS_40_30), id: ProductBarcodeType.CONTINUOUS_40_30},
      {
        description: this.translate.instant('PRODUCT_FORM.' + ProductBarcodeType.CONTINUOUS_63_37),
        id: ProductBarcodeType.CONTINUOUS_63_37
      }
    ];
  }
}
