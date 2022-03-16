import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationModule } from 'src/app/core/navigation/navigation.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SidebarComponent } from './sidebar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavigationModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
  ],
    declarations: [SidebarComponent],
    exports: [SidebarComponent]
})
export class SidebarModule { }
