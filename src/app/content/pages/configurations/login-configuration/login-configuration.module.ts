import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginConfigurationComponent} from "./login-configuration.component";
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
  {path: '', component: LoginConfigurationComponent}
];

@NgModule({
  declarations: [
    LoginConfigurationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
  ]
})
export class LoginConfigurationModule { }
