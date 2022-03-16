import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAmazonComponent } from './product-amazon.component';
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {SharedModule} from "../../../../shared/shared.module";
import { ProductListComponent } from './components/product-list/product-list.component';
import {MatIconModule} from "@angular/material/icon";

const routes: Routes = [
  {path: '', component: ProductAmazonComponent}
]

@NgModule({
  declarations: [
    ProductAmazonComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    MatCheckboxModule,
    FormsModule,
    SharedModule,
    MatIconModule
  ],
  entryComponents: [
    ProductListComponent
  ]

})
export class ProductAmazonModule { }
