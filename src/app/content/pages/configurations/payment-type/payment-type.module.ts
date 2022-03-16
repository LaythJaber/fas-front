import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentTypeComponent } from './payment-type.component';
import {PaymentTypeFormModalComponent} from './payment-type-form-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslateModule} from '@ngx-translate/core';
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '../../../../shared/shared.module';
const routes: Routes = [
  {path: '', component: PaymentTypeComponent}
];
@NgModule({
  declarations: [PaymentTypeComponent, PaymentTypeFormModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
    MatProgressSpinnerModule,
    TranslateModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    MatButtonModule,
    NgbTooltipModule,
    FormsModule
  ],
  entryComponents: [
    PaymentTypeFormModalComponent
  ],
  exports: [
    PaymentTypeFormModalComponent
  ]
})
export class PaymentTypeModule { }
