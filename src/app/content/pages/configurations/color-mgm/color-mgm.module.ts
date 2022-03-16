import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorMgmComponent } from './color-mgm.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule, MatDividerModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {ColorFormModalComponent} from './color-form-modal.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {MatCheckboxModule} from "@angular/material/checkbox";

const routes: Routes = [
  {path: '', component: ColorMgmComponent}
];

@NgModule({
  declarations: [ColorMgmComponent, ColorFormModalComponent],
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
        FormsModule,
        ColorPickerModule,
        MatCheckboxModule
    ],
  entryComponents: [
    ColorFormModalComponent
  ],
  exports: [ ColorFormModalComponent ]
})
export class ColorMgmModule { }
