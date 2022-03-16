import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PriceListComponent } from './price-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatDatepickerModule, MatIconModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PriceListFormComponent } from './price-list-form/price-list-form.component';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';

const routes: Routes = [
  {path: '', component: PriceListComponent}
];

export const CustomCurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
};


@NgModule({
  declarations: [PriceListComponent, PriceListFormComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
    ReactiveFormsModule,
    NgbPaginationModule,
    MatDatepickerModule,
    NgbDropdownModule,
    FormsModule,
    NgbTooltipModule,
    CurrencyMaskModule
  ],
  entryComponents: [
    PriceListFormComponent
  ] ,
   providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  exports: [
    PriceListFormComponent
  ]
})
export class PriceListModule { }
