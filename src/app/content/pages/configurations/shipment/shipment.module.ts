import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentComponent } from './shipment.component';
import {RouterModule, Routes} from "@angular/router";
import {NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {TooltipModule} from "ngx-bootstrap";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";
import { ShipmentFormComponent } from './shipment-form/shipment-form.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CURRENCY_MASK_CONFIG} from "ng2-currency-mask/src/currency-mask.config";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {SharedModule} from "../../../../shared/shared.module";

export const CustomCurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
};

const routes: Routes = [
  {
    path: '', component: ShipmentComponent
  }
];

@NgModule({
  declarations: [
    ShipmentComponent,
    ShipmentFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatTabsModule,
    MatDatepickerModule,
    NgSelectModule,
    NgbDropdownModule,
    TooltipModule,
    MatCheckboxModule,
    CurrencyMaskModule,
    SharedModule
  ],
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    }
  ],
  entryComponents: [
    ShipmentFormComponent
  ]
})
export class ShipmentModule { }
