import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UmComponent } from './um.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UmModalComponent } from './um-modal.component';


const routes: Routes = [{
  path: '',
  component: UmComponent
}];
@NgModule({
  declarations: [UmComponent, UmModalComponent],
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
  ], entryComponents: [
    UmModalComponent
  ],
  exports: [UmModalComponent]
})
export class UmModule { }
