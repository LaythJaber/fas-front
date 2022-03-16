import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { FasAdminComponent } from './fas-admin.component';


const routes: Routes = [
  {
    path: '',
    component: FasAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'fas-dashboard',
        pathMatch: 'full',
      },
      {
        path: 'fas-dashboard',
        data: {
          module: 'DASHBOARD'
        },
        loadChildren: './content/pages/dashboard/fas-dashboard.module#FasDashboardModule'
      },
      {
        path: 'fas-applications',
        data: {
          module: 'WEB_POSITIONING'
        },
        loadChildren: './content/pages/application/fas-application.module#FasApplicationModule'
      },
      {
        path: 'fas-users',
        data: {
          module: 'TRANSACTION'
        },
        loadChildren: './content/pages/users/fas-users.module#FasUsersModule'
      },
      {
        path: 'fas-ds',
        data: {
          module: 'PURCHASE'
        },
        loadChildren: './content/pages/ds/fas-ds.module#FasDsModule'
      },
      {
        path: 'fas-meet',
        data: {
          module: 'LEGAL'
        },
        loadChildren: './content/pages/video/fas-video.module#FasVideoModule'
      },
      {
        path: 'fas-calendar',
        data: {
          module: 'LEGAL'
        },
        loadChildren: './content/pages/calendar/fas-calendar.module#FasMeetSchedulerModule'
      },
    ]
  }]

@NgModule({
  declarations: [FasAdminComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),


  ]
})
export class FasAdminModule { }
