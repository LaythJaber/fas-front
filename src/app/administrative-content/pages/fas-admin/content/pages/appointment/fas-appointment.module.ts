import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentComponent } from './appointment.component';
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [
  {
    path: '',
    component: AppointmentComponent
  }
];


@NgModule({
  declarations: [AppointmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class FasAppointmentModule { }
