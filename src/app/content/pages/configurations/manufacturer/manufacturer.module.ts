import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturerComponent } from './manufacturer.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatDividerModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManufacturerFormModalComponent } from './manufacturer-form-modal.component';

const routes: Routes = [
  {path: '', component: ManufacturerComponent}
];

@NgModule({
  declarations: [ManufacturerComponent, ManufacturerFormModalComponent],
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
    ManufacturerFormModalComponent
  ],
  exports: [ ManufacturerFormModalComponent ]
})
export class ManufacturerModule { }
