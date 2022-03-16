import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CodiceIVAComponent} from './codice-iva.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatDividerModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule} from '@angular/material';
import {SharedModule} from '../../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {CodiceIvaFormModalComponent} from './codice-iva-form-modal.component';

const routes: Routes = [
  {path: '', component: CodiceIVAComponent}
];
@NgModule({
  declarations: [CodiceIVAComponent, CodiceIvaFormModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    SharedModule.forChild(),
    MatDividerModule,
    NgbTypeaheadModule,
    MatProgressSpinnerModule,
    NgbTooltipModule,
    FormsModule
  ],
  entryComponents: [
    CodiceIvaFormModalComponent
  ],
  exports: [
    CodiceIvaFormModalComponent
  ]
})

export class CodiceIVAModule { }
