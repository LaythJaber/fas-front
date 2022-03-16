import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneralComponent} from './general.component';
import {RouterModule, Routes} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";
import {MatRadioModule} from "@angular/material/radio";
import {NgSelectModule} from "@ng-select/ng-select";

const routes: Routes = [
  {
    path: '', component: GeneralComponent
  }
];

@NgModule({
  declarations: [
    GeneralComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TranslateModule,
    MatRadioModule,
    NgSelectModule,
    FormsModule,
  ]
})
export class GeneralModule { }
