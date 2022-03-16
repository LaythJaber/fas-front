import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGoogleMerchantComponent } from './product-google-merchant.component';
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../../../shared/shared.module";
import {NgbTooltipModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {MatButtonModule} from "@angular/material/button";
import { ProductListComponent } from './components/product-list/product-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { ProductMgmComponent } from './components/product-mgm/product-mgm.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatCheckboxModule} from "@angular/material/checkbox";

const routes: Routes = [
  {path: '', component: ProductGoogleMerchantComponent}
];

@NgModule({
  declarations: [
    ProductGoogleMerchantComponent,
    ProductListComponent,
    ProductMgmComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        SharedModule,
        NgbTooltipModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDatepickerModule,
        InfiniteScrollModule,
        MatCheckboxModule,
        FormsModule,
        NgbTypeaheadModule,
    ],
  entryComponents: [
    ProductListComponent,
    ProductMgmComponent
  ]
})
export class ProductGoogleMerchantModule { }
