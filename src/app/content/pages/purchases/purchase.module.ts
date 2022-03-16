import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {NgbModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from "@angular/material/button";
import { PurchaseDetailsComponent } from './purchase-details/purchase-details.component';
import {MatTabsModule} from "@angular/material/tabs";

const routes: Routes = [
  {
    path: '', component: PurchaseListComponent,
  },
  {
    path: 'details/:id',
    component: PurchaseDetailsComponent
  }
];

@NgModule({
  declarations: [
    PurchaseListComponent,
    PurchaseDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
    NgbPaginationModule,
    TranslateModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgbModule,
    MatTabsModule,
    FormsModule,
  ]
})
export class PurchaseModule { }
