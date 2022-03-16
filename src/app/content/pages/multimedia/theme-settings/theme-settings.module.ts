import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeSettingsComponent} from "./theme-settings.component";
import {MatTabsModule} from "@angular/material/tabs";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule, Routes} from "@angular/router";
import {ColorPickerModule} from "ngx-color-picker";
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {path: '', component: ThemeSettingsComponent}
];

@NgModule({
  declarations: [ThemeSettingsComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    ColorPickerModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
  ]
})
export class ThemeSettingsModule { }
