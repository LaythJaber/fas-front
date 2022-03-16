import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StockManagementComponent} from './stock-management.component';
import {NgbDropdownModule, NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSnackBarModule,
  MatTableModule
} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubheaderModule} from '../../../layout/components/subheader/subheader.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgSelectModule} from '@ng-select/ng-select';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {StockHistoryComponent} from './stock-history/stock-history.component';


const routes: Routes = [
  {
    path: '',
    component: StockManagementComponent
  }
];
@NgModule({
  declarations: [StockManagementComponent, StockHistoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    TranslateModule,
    NgbModule,
    ReactiveFormsModule,
    SubheaderModule,
    NgxDatatableModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRippleModule,
    NgbDropdownModule,
    MatSnackBarModule,
    MatDialogModule,
    NgbPaginationModule,
    MatProgressSpinnerModule,
    NgSelectModule,
    MatIconModule,
    CurrencyMaskModule,
    MatCheckboxModule,
    FormsModule
  ],
  exports: [
    StockHistoryComponent
  ],
  // exports: [
  //   StockHistoryComponent
  // ],
  entryComponents: [
    StockHistoryComponent
  ]
})
export class StockManagementModule { }
