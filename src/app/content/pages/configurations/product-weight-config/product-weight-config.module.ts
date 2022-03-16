import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductWeightConfigComponent} from "./product-weight-config.component";
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";

const routes: Routes =  [
  {path: '', component: ProductWeightConfigComponent}
];

@NgModule({
  declarations: [
    ProductWeightConfigComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ]
})
export class ProductWeightConfigModule { }
