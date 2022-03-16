import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';
import {RouterModule, Routes} from "@angular/router";



const routes: Routes = [
  {
    path: '',
    component: VideoComponent
  }
];


@NgModule({
  declarations: [VideoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class FasVideoModule { }
