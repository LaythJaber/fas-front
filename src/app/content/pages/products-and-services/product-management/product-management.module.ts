import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductManagementFormComponent } from './product-management-form/product-management-form.component';
import { ProductManagementComponent } from './product-management.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { StockManagementModule } from '../../stock-and-movement/stock-management/stock-management.module';
import { ProductFormService } from 'src/app/shared/services/product-form.service';
import { ProductHistoryComponent } from './product-history/product-history.component';
import { MatTreeModule} from '@angular/material/tree';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatTabsModule} from "@angular/material/tabs";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {MatTooltipModule} from "@angular/material/tooltip";
import { ProductImageFormComponent } from './product-image-form/product-image-form.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CKEditorModule} from "@ddobei/ckeditor4-angular";


const routes: Routes = [
  {path: '', component: ProductManagementComponent},
  {path: 'product', component: ProductManagementFormComponent},
  {path: 'product/:id', component: ProductManagementFormComponent}
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
  declarations: [ProductManagementComponent, ProductManagementFormComponent, ProductHistoryComponent, ProductImageFormComponent  ],
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
        CurrencyMaskModule,
        MatCheckboxModule,
        MatDialogModule,
        // StockManagementModule,
        FormsModule,
        NgbTooltipModule,
        MatTreeModule,
        MatFormFieldModule,
        NgbModule,
        CarouselModule,
        MatTabsModule,
        AngularEditorModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        CKEditorModule
    ],
  providers: [
    ProductFormService,
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    }
  ],
  entryComponents: [
    ProductManagementFormComponent,
    ProductImageFormComponent
  ]
})
export class ProductManagementModule {
}
