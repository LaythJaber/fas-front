import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FasSidebarComponent} from "./fas-sidebar.component";
import {FasNavigationModule} from "../fas-navigation/fas-navigation.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FasNavigationModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
  ],
    declarations: [FasSidebarComponent],
    exports: [FasSidebarComponent]
})
export class FasSidebarModule { }
