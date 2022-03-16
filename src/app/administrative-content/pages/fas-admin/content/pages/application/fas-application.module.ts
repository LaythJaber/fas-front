import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import {RouterModule, Routes} from "@angular/router";
import { ApplicationFormComponent } from './application-form/application-form.component';
import {TranslateModule} from "@ngx-translate/core";
import {NgbDropdownModule, NgbModalModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";


const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent
  }
];

@NgModule({
  declarations: [ApplicationComponent, ApplicationFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModalModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NgbDropdownModule,
    MatButtonModule,
    NgbTooltipModule
  ],
  entryComponents: [ApplicationFormComponent]
})
export class FasApplicationModule { }
