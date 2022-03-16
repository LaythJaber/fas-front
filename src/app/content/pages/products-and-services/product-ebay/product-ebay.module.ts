import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductEbayComponent } from './product-ebay.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {SharedModule} from "../../../../shared/shared.module";
import { ProductListComponent } from './components/product-list/product-list.component';
import {MatIconModule} from "@angular/material/icon";
import { ProductOffersComponent } from './components/product-offers/product-offers.component';

const routes: Routes = [
  {path: '', component: ProductEbayComponent}
];


@NgModule({
  declarations: [
    ProductEbayComponent,
    ProductListComponent,
    ProductOffersComponent
  ],
  imports: [
      CommonModule,
      RouterModule.forChild(routes),
      FormsModule,
      ReactiveFormsModule,
      TranslateModule,
      NgSelectModule,
      MatCheckboxModule,
      NgbPaginationModule,
      NgbTypeaheadModule,
      MatButtonModule,
      NgbTooltipModule,
      MatDatepickerModule,
      SharedModule,
      MatIconModule,
  ],
  entryComponents: [
    ProductListComponent,
    ProductOffersComponent
  ]
})
export class ProductEbayModule { }
