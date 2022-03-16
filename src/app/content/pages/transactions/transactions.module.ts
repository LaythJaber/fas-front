import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {NgbModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {TransactionsComponent} from "./transactions.component";
import { TransactionModalComponent } from './components/transaction-modal/transaction-modal.component';
import {MatIconModule} from "@angular/material/icon";

const routes: Routes = [
  {path: '', component: TransactionsComponent}
];


@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionModalComponent,
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
    MatIconModule,
    FormsModule,
  ],
  entryComponents: [
    TransactionModalComponent
  ]
})
export class TransactionsModule { }
