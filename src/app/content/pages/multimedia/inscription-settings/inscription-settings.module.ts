import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionSettingsComponent } from './inscription-settings.component';
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
  {path: '', component: InscriptionSettingsComponent},
];
@NgModule({
  declarations: [InscriptionSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
  ]
})
export class InscriptionSettingsModule { }
