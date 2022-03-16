import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImportationComponent} from './importation.component';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatMenuModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';

const routes: Routes = [
  {path: '', component: ImportationComponent}
];

@NgModule({
  declarations: [ImportationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbPaginationModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    MatDialogModule,
  ]
})
export class ImportationModule {
}
