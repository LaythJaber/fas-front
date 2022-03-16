import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {PromotionComponent} from './promotion.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDatepickerModule, MatDialogModule, MatIconModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {NgbDropdownModule, NgbModule, NgbPaginationModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {PromotionFormComponent} from './promotion-form/promotion-form.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {OwlDateTimeModule} from 'ng-pick-datetime';
import {RouterModule, Routes} from '@angular/router';
import {FilterClientsComponent} from './filter-clients/filter-clients.component';
import {SharedModule} from '../../../shared/shared.module';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {CURRENCY_MASK_CONFIG} from 'ng2-currency-mask/src/currency-mask.config';
import {CustomCurrencyMaskConfig} from '../products-and-services/product-management/product-management.module';
import {TemplateEditorComponent} from './template-editor/template-editor.component';

const routes: Routes = [
  {path: '', component: PromotionComponent},
  {path: 'new', component: PromotionFormComponent},
  {path: 'update', component: PromotionFormComponent}
];

@NgModule({
  declarations: [PromotionComponent, PromotionFormComponent, FilterClientsComponent, TemplateEditorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule,
    NgbTooltipModule,
    NgSelectModule,
    OwlDateTimeModule,
    MatDialogModule,
    MatDatepickerModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
    MatIconModule,
    NgbModule,
    NgbPaginationModule,
    NgbDropdownModule,
    CurrencyMaskModule,
    FormsModule,
  ], entryComponents: [
    FilterClientsComponent, TemplateEditorComponent
  ],
  providers: [
    DatePipe
  ]
})
export class PromotionModule {
}
