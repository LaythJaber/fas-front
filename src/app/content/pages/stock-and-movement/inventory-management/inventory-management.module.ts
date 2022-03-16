import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InventoryManagementComponent} from './inventory-management.component';
import {MatButtonModule, MatDatepickerModule, MatDialogModule, MatIconModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule, Routes} from '@angular/router';
import {InventoryManagementFormComponent} from './inventory-management-form/inventory-management-form.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../../../../shared/shared.module';
import {CdkAccordionModule} from '@angular/cdk/accordion';

const routes: Routes = [
  {
    path: '',
    component: InventoryManagementComponent
  },
  {path: 'inventory', component: InventoryManagementFormComponent},
  {path: 'inventory/:id', component: InventoryManagementFormComponent}
];

@NgModule({
  declarations: [InventoryManagementComponent, InventoryManagementFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDatepickerModule,
    MatButtonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatDialogModule,
    NgSelectModule,
    SharedModule,
    CdkAccordionModule
  ], entryComponents: [InventoryManagementFormComponent]
})
export class InventoryManagementModule {
}
