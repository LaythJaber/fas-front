import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SizeMgmComponent} from './size-mgm.component';
import {NgbModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule, MatDividerModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import {SizeFormModalComponent} from './size-form-modal.component';
import {MatCheckboxModule} from "@angular/material/checkbox";

const routes: Routes = [
  {path: '', component: SizeMgmComponent}
];

@NgModule({
  declarations: [SizeMgmComponent, SizeFormModalComponent],
    imports: [
        CommonModule,
        NgbModule,
        MatButtonModule,
        TranslateModule,
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
        FormsModule,
        MatCheckboxModule
    ],
  entryComponents: [
    SizeFormModalComponent
  ],
  exports: [SizeFormModalComponent]
})
export class SizeMgmModule {
}
