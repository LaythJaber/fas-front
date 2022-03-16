import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepartoComponent } from './reparto.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModalModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { RepartoFormModalComponent } from './reparto-form-modal.component';

const routes: Routes = [{
  path: '',
  component: RepartoComponent
}];
@NgModule({
  declarations: [RepartoComponent, RepartoFormModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    NgbModalModule,
    SharedModule.forChild(),
    FormsModule,
  ], entryComponents:[
    RepartoFormModalComponent
  ], exports: [
    RepartoFormModalComponent
  ]
})
export class RepartoModule { }
