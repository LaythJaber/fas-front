import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import {FasQuickSidebarComponent} from "./fas-quick-sidebar.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PerfectScrollbarModule,
    NgbTabsetModule,
  ],
  declarations: [FasQuickSidebarComponent],
  exports: [FasQuickSidebarComponent]
})
export class FasQuickSidebarModule { }
