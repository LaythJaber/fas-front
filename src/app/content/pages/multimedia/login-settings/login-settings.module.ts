import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginSettingsComponent} from "./login-settings.component";
import {RouterModule, Routes} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDividerModule} from "@angular/material/divider";

const routes: Routes = [
  {path: '', component: LoginSettingsComponent},
];

@NgModule({
  declarations: [LoginSettingsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        TranslateModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatDividerModule,
    ]
})
export class LoginSettingsModule { }
