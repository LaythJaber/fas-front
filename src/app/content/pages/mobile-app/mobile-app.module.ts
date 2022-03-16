import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateAppConfigurationComponent } from './update-app-configuration/update-app-configuration.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {TranslateModule} from "@ngx-translate/core";
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";

const routes: Routes = [
  {
    path: '', component: UpdateAppConfigurationComponent,
  },
];

@NgModule({
  declarations: [
    UpdateAppConfigurationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    TranslateModule,
    NgbAccordionModule,
    MatIconModule,
    MatCheckboxModule,
  ]
})
export class MobileAppModule { }
