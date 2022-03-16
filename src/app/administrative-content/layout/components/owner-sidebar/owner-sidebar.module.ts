import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {OwnerSidebarComponent} from './owner-sidebar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {OwnerNavigationModule} from '../owner-navigation/owner-navigation.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    OwnerNavigationModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
  ],
    declarations: [OwnerSidebarComponent],
    exports: [OwnerSidebarComponent]
})
export class OwnerSidebarModule { }
