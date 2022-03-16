import { Component, OnInit } from '@angular/core';
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";

@Component({
  selector: 'app-payment-config',
  templateUrl: './payment-config.component.html',
  styleUrls: ['./payment-config.component.scss']
})
export class PaymentConfigComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit() {
    this.sendBreadCrumb();
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION','PAYMENT']);
  }

}
