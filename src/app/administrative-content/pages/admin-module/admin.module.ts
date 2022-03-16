import {OwnerService} from '../../../shared/services/owner.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EnterpriseMgmComponent} from './components/enterprise-mgm/enterprise-mgm.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {NgbDropdownModule, NgbPaginationModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {OperatorMgmComponent} from './components/operator-mgm/operator-mgm.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {EnterpriseMgmFormComponent} from './components/enterprise-mgm/enterprise-mgm-form/enterprise-mgm-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {SellPointsComponent} from './components/enterprise-mgm/sell-points/sell-points.component';
import {MatIconModule} from '@angular/material/icon';
import {SellPointFormComponent} from './components/enterprise-mgm/sell-points/sell-point-form/sell-point-form.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {OwlDateTimeModule} from 'ng-pick-datetime';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OperatorMgmFormDialogComponent} from './components/operator-mgm/operator-mgm-form-dialog/operator-mgm-form-dialog.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FocusInvalidInputDirective} from './components/operator-mgm/operator-mgm-form-dialog/focus-invalid-input.directive';
import {RoleMgmComponent} from './components/role-mgm/role-mgm.component';
import {RoleFormMgmComponent} from './components/role-mgm/role-form-mgm/role-form-mgm.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ConfigurationMgmComponent} from './components/configuration-mgm/configuration-mgm.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {MatTabsModule} from "@angular/material/tabs";
import { SmtpConfigFormComponent } from './components/configuration-mgm/smtp-config-form/smtp-config-form.component';
import { SmsConfigFormComponent } from './components/configuration-mgm/sms-config-form/sms-config-form.component';
import { ProductConfigFormComponent } from './components/configuration-mgm/product-config-form/product-config-form.component';
import {SharedModule} from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EnterpriseMgmComponent,
    children: [
      {
        path: 'enterprise',
        component: SellPointsComponent
      }
    ]
  },
  {
    path: 'operators',
    component: OperatorMgmComponent
  },
  {
    path: 'roles',
    component: RoleMgmComponent
  },
  {
    path: 'configurations',
    component: ConfigurationMgmComponent
  }
];

@NgModule({
  declarations: [
    EnterpriseMgmComponent,
    OperatorMgmComponent,
    EnterpriseMgmFormComponent,
    SellPointsComponent,
    SellPointFormComponent,
    OperatorMgmFormDialogComponent,
    FocusInvalidInputDirective,
    RoleMgmComponent,
    RoleFormMgmComponent,
    ConfigurationMgmComponent,
    SmtpConfigFormComponent,
    SmsConfigFormComponent,
    ProductConfigFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    NgbDropdownModule,
    MatDialogModule,
    NgbPaginationModule,
    TranslateModule,
    NgSelectModule,
    MatIconModule,
    NgxMaterialTimepickerModule,
    OwlDateTimeModule,
    MatProgressSpinnerModule,
    ColorPickerModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    FormsModule,
    PerfectScrollbarModule,
    MatTabsModule,
    NgbTooltipModule,
    SharedModule,
  ],
  entryComponents: [
    EnterpriseMgmFormComponent,
    SellPointFormComponent,
    OperatorMgmFormDialogComponent,
    RoleFormMgmComponent
  ],
  providers: [
    OwnerService
  ]
})
export class AdminModule {
}
