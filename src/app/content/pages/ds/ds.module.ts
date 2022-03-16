import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsComponent } from './ds.component';
import {RouterModule, Routes} from "@angular/router";
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";


const routes: Routes = [
  {
    path: '',
    component: DsComponent
  }
];


@NgModule({
  declarations: [DsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,

  ]
})
export class DsModule { }
