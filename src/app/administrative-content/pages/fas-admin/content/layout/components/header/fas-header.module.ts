import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {NgbDropdownModule, NgbModalModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatRippleModule} from '@angular/material';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from "../../../../../../../shared/shared.module";
import {FasHeaderComponent} from "./fas-header.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    NgbModalModule,
    PerfectScrollbarModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    NgbTooltipModule,
    SharedModule
  ],
  declarations: [FasHeaderComponent],
  exports: [FasHeaderComponent]
})
export class FasHeaderModule {
}
