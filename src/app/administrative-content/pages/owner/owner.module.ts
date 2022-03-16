import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OwnerComponent} from './owner.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {GroupMgmComponent} from './components/group-mgm/group-mgm.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TreeViewComponent} from './components/group-mgm/treeview/tree-view.component';
import {GroupFormModalComponent} from './components/group-mgm/group-form-modal/group-form-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {SuperAdminMgmFormComponent} from './components/group-mgm/super-admin-mgm-form/super-admin-mgm-form.component';
import {
  NgbButtonsModule,
  NgbDropdownModule, NgbPaginationModule,
  NgbTabsetModule,
  NgbTooltipModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DateMgmFormModalComponent} from './components/group-mgm/date-mgm-form-modal/date-mgm-form-modal.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {TypesOfActivitiesComponent} from './components/types-of-activities/types-of-activities.component';
import {TypesOfActivitiesFormComponent} from './components/types-of-activities/types-of-activities-form.component';
import {LicenseConfigurationComponent} from './components/license-configuration/license-configuration.component';
import {LicenseConfigFormComponent} from './components/license-configuration/license-config-form/license-config-form.component';
import {MatChipsModule} from '@angular/material/chips';
import { ZipCodeComponent } from './components/zip-code/zip-code.component';
import {SharedModule} from "../../../shared/shared.module";

const routes: Routes = [
  {
    path: '',
    component: OwnerComponent,
    children: [
      {
        path: '',
        component: GroupMgmComponent
      },
      {
        path: 'types-of-activities',
        component: TypesOfActivitiesComponent
      },
      {
        path: 'license-config',
        component: LicenseConfigurationComponent
      },
      {
        path: 'cap-config',
        component: ZipCodeComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    OwnerComponent,
    GroupMgmComponent,
    TreeViewComponent,
    GroupFormModalComponent,
    SuperAdminMgmFormComponent,
    DateMgmFormModalComponent,
    TypesOfActivitiesComponent,
    TypesOfActivitiesFormComponent,
    LicenseConfigurationComponent,
    LicenseConfigFormComponent,
    ZipCodeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    TranslateModule,
    MatExpansionModule,
    NgbDropdownModule,
    NgSelectModule,
    MatSnackBarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    NgbButtonsModule,
    MatMenuModule,
    NgbTypeaheadModule,
    MatChipsModule,
    NgbTooltipModule,
    NgbTabsetModule,
    FormsModule,
    NgbPaginationModule,
    SharedModule
  ],
  entryComponents: [
    GroupFormModalComponent,
    SuperAdminMgmFormComponent,
    DateMgmFormModalComponent,
    TypesOfActivitiesFormComponent,
    LicenseConfigFormComponent
  ]
})
export class OwnerModule {
}
