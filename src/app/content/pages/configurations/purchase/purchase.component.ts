import { Component, OnInit } from '@angular/core';
import {PurchaseConfigService} from "../../../../shared/services/purchase/purchase-config.service";
import {PurchaseConfiguration} from "../../../../shared/models/purchase/purchase-configuration";

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  purchaseConfiguration: PurchaseConfiguration;

  constructor(
    private purchaseConfigService: PurchaseConfigService
  ) {
    this.getPurchaseConfiguration();
  }

  ngOnInit() {
  }

  getPurchaseConfiguration() {
    this.purchaseConfigService.getPurchaseConfiguration().subscribe(
      (response) => {
        this.purchaseConfiguration = response;
      });
  }

}
