import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ReturnPurchaseDetailsComponent } from './return-purchase-details/return-purchase-details.component';
import {MatButtonModule} from '@angular/material/button';
import {ReturnPurchaseConfigComponent} from './return-purchase-config/return-purchase-config.component';
import {ReturnPurchaseListComponent} from './return-purchase-list/return-purchase-list.component';
import {SharedModule} from '../../../shared/shared.module';

const routes: Routes = [
  {path: 'config', component: ReturnPurchaseConfigComponent},
  {path: 'list', component: ReturnPurchaseListComponent},
  {path: 'details/:id', component: ReturnPurchaseDetailsComponent}
];

@NgModule({
  declarations: [
    ReturnPurchaseConfigComponent,
    ReturnPurchaseListComponent,
    ReturnPurchaseDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    MatCheckboxModule,
    AngularEditorModule,
    NgbPaginationModule,
    SharedModule,
    MatDatepickerModule,
    NgbTypeaheadModule,
    MatButtonModule,
    NgbTooltipModule
  ]
})
export class ReturnPurchaseModule { }
