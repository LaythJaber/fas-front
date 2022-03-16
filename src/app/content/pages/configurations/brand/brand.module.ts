import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandComponent } from './brand.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrandFormModalComponent } from './brand-form-modal.component';

const routes: Routes = [
  {path: '', component: BrandComponent}
];

@NgModule({
  declarations: [BrandComponent, BrandFormModalComponent],
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
      BrandFormModalComponent
    ],
    exports: [ BrandFormModalComponent ]
})
export class BrandModule { }
