import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {FasBreadcrumbComponent} from "./fas-breadcrumb.component";

@NgModule({
  declarations: [FasBreadcrumbComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule
  ], exports: [
    FasBreadcrumbComponent
  ]
})
export class FasBreadcrumbModule { }
