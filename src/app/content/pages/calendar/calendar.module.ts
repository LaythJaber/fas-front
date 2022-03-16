import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {SchedulerModule} from "angular-calendar-scheduler";
import {FormsModule} from "@angular/forms";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import {CalendarComponent} from "./calendar.component";
registerLocaleData(localeIt);



const routes: Routes = [
  {
    path: '',
    component: CalendarComponent
  }
];


@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange', logEnabled: true }),
    FormsModule,
    MatProgressSpinnerModule,
  ]
})
export class MeetSchedulerModule { }
