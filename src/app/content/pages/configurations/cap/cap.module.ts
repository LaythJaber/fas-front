import {RouterModule, Routes} from '@angular/router';
import {CapComponent} from './cap.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';

const routes: Routes = [
  {
    path: '', component: CapComponent
  }

];
@NgModule({
  declarations: [
    CapComponent,
  ], imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TranslateModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    NgbTypeaheadModule,
    MatButtonModule
  ],
  entryComponents: [
    CapComponent
  ],
})
export class CapModule {
}
