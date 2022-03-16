import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MovementManagementComponent} from './movement-management.component';
import {MovementManagementFormComponent} from './movement-management-form/movement-management-form.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatButtonModule, MatDatepickerModule, MatDialogModule, MatIconModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {SharedModule} from '../../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MovementManagementComponent
  },
  {path: 'movement', component: MovementManagementFormComponent},
  {path: 'movement/:id', component: MovementManagementFormComponent}
];

@NgModule({
  declarations: [MovementManagementComponent, MovementManagementFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    NgbModule,
    FormsModule,
    MatIconModule,
    CurrencyMaskModule,
    MatDialogModule,
    SharedModule,
  ], entryComponents: [MovementManagementFormComponent]
})
export class MovementManagementModule {
}
