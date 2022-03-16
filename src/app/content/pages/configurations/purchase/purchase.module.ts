import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import {RouterModule, Routes} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {ConfigurationPurchaseComponent } from './components/configuration/configuration-purchase.component';
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {SharedModule} from "../../../../shared/shared.module";
import {ScrollingModule} from "@angular/cdk/scrolling";
import { CategorySortComponent } from './components/category-sort/category-sort.component';

const routes: Routes = [
  {path: '', component: PurchaseComponent}
];


@NgModule({
  declarations: [
    PurchaseComponent,
    ConfigurationPurchaseComponent,
    CategorySortComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    DragDropModule,
    ScrollingModule,
    SharedModule
  ]
})
export class PurchaseModule { }
