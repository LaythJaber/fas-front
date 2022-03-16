import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LineaFormModalComponent} from './linea-form-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LineaComponent} from './linea.component';
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../../../../shared/shared.module';
import {MatButtonModule, MatDividerModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule} from '@angular/material';

const routes: Routes = [
  {path: '', component: LineaComponent}
];

@NgModule({
  declarations: [LineaComponent, LineaFormModalComponent],
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
    LineaFormModalComponent
  ],
  exports: [ LineaFormModalComponent ]
})
export class LineaModule {
}
