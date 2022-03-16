import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatDividerModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule} from '@angular/material';
import {SharedModule} from '../../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {PaymentConfigComponent} from "./payment-config.component";
import {MatTabsModule} from "@angular/material/tabs";
import { StripeFormComponent } from './components/stripe-form/stripe-form.component';
import { CashFormComponent } from './components/cash-form/cash-form.component';
import { PaypalFormComponent } from './components/paypal-form/paypal-form.component';
import {MatCheckboxModule} from "@angular/material/checkbox";


const routes: Routes = [
  {path: '', component: PaymentConfigComponent}
];
@NgModule({
  declarations: [PaymentConfigComponent, StripeFormComponent, CashFormComponent, PaypalFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        TranslateModule,
        MatTableModule,
        MatPaginatorModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        SharedModule.forChild(),
        MatDividerModule,
        NgbTypeaheadModule,
        MatProgressSpinnerModule,
        NgbTooltipModule,
        MatTabsModule,
        FormsModule,
        MatCheckboxModule
    ],
  entryComponents: [
  ],
  exports: [
  ]
})

export class PaymentConfigModule { }
