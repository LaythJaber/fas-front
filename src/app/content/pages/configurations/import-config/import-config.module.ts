import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ImportConfigComponent} from './import-config.component';
import {OwlDateTimeModule} from 'ng-pick-datetime';


const routes: Routes = [
  {path: '', component: ImportConfigComponent}
];

@NgModule({
  declarations: [ImportConfigComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    OwlDateTimeModule,
    FormsModule,
  ]
})

export class ImportConfigModule {
}
