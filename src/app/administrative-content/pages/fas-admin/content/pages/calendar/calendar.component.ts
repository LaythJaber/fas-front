import { Component, OnInit, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { Subject } from 'rxjs';

import {
  endOfDay,
  addMonths, addHours, addDays, startOfHour, setHours, addMinutes
} from 'date-fns';
import {
  DAYS_IN_WEEK,
  SchedulerViewDay,
  SchedulerViewHour,
  SchedulerViewHourSegment,
  CalendarSchedulerEvent,
  CalendarSchedulerEventAction,
  startOfPeriod,
  endOfPeriod,
  addPeriod,
  subPeriod,
  SchedulerDateFormatter,
  SchedulerEventTimesChangedEvent, CalendarSchedulerEventStatus, SchedulerViewEvent
} from 'angular-calendar-scheduler';
import {
  CalendarView,
  CalendarDateFormatter,
  DateAdapter
} from 'angular-calendar';
import {CalendarService} from "../../../../../../shared/services/calendar.service";
import {Appointment} from "../../../../../../shared/models/appointment";
import {UserService} from "../../../../../../shared/services/user.service";
import {AppointmentService} from "../../../../../../shared/services/appointment.service";



@Component({
  selector: 'app-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: SchedulerDateFormatter
  }]
})
export class CalendarComponent implements OnInit {
  title = 'Angular Calendar Scheduler Demo';

  CalendarView = CalendarView;

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  viewDays: number = DAYS_IN_WEEK;
  refresh: Subject<any> = new Subject();
  locale: string = 'en';
  hourSegments: number = 1;
  weekStartsOn: number = 1;
  startsWithToday: boolean = true;
  activeDayIsOpen: boolean = true;
  excludeDays: number[] = [0]; // [0];
  dayStartHour: number = 8;
  dayEndHour: number = 17;

  minDate: Date = new Date();
  maxDate: Date = endOfDay(addMonths(new Date(), 1));
  dayModifier: Function;
  hourModifier: Function;
  segmentModifier: Function;
  eventModifier: Function;
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;

  actions: CalendarSchedulerEventAction[] = [
    {
      when: 'enabled',
      label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">cancel</i></span>',
      title: 'Delete',
      onClick: (event: CalendarSchedulerEvent): void => {
        console.log('Pressed action \'Delete\' on event ' + event.id);


        this.appointmentService.deleteAppointment(event.id).subscribe( response => {
          this.events = this.events.filter(function( obj ) {
            return obj.id !== event.id;
          });
        })
      }
    },
    {
      when: 'cancelled',
      label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">autorenew</i></span>',
      title: 'Restore',
      onClick: (event: CalendarSchedulerEvent): void => {
        console.log('Pressed action \'Restore\' on event ' + event.id);
      }
    }
  ];

  events: CalendarSchedulerEvent[];
  user: Account;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustViewDays();
  }

  constructor(@Inject(LOCALE_ID) locale: string, private calendarService: CalendarService,
              private dateAdapter: DateAdapter,
              private userService: UserService,
              private appointmentService: AppointmentService) {
    this.locale = locale;

    // this.dayModifier = ((day: SchedulerViewDay): void => {
    //     day.cssClass = this.isDateValid(day.date) ? '' : 'cal-disabled';
    // }).bind(this);

    // this.hourModifier = ((hour: SchedulerViewHour): void => {
    //     hour.cssClass = this.isDateValid(hour.date) ? '' : 'cal-disabled';
    // }).bind(this);

    this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
      segment.isDisabled = !this.isDateValid(segment.date);
    }).bind(this);

    this.eventModifier = ((event: CalendarSchedulerEvent): void => {
      event.isDisabled = !this.isDateValid(event.start);
    }).bind(this);

    this.adjustViewDays();
    this.dateOrViewChanged();
  }

  ngOnInit(): void {

    this.appointmentService.getAppointments().subscribe(response => {
      this.events =  response.map( (u: any) => {
        u.start = new Date(u.startDate);
        u.end = new Date(u.endDate);
        u.actions = [];
        u.isClickable = false;
        return u;
      });
    });

    /*
    this.calendarService.getNewEvents(this.actions)
      .then((events: CalendarSchedulerEvent[]) => this.events = events); */
  }

  adjustViewDays(): void {
    const currentWidth: number = window.innerWidth;
    if (currentWidth <= 450) {
      this.viewDays = 1;
    } else if (currentWidth <= 768) {
      this.viewDays = 3;
    } else {
      this.viewDays = DAYS_IN_WEEK;
    }
  }

  changeDate(date: Date): void {
    console.log('changeDate', date);
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  changeView(view: CalendarView): void {
    console.log('changeView', view);
    this.view = view;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    if (this.startsWithToday) {
      this.prevBtnDisabled = !this.isDateValid(subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
      this.nextBtnDisabled = !this.isDateValid(addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1));
    } else {
      this.prevBtnDisabled = !this.isDateValid(endOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, subPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
      this.nextBtnDisabled = !this.isDateValid(startOfPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, addPeriod(this.dateAdapter, CalendarView.Day/*this.view*/, this.viewDate, 1)));
    }

    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  private isDateValid(date: Date): boolean {
    return /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate;
  }

  dayHeaderClicked(day: SchedulerViewDay): void {
    console.log('dayHeaderClicked Day', day);
  }

  hourClicked(hour: SchedulerViewHour): void {
    console.log('hourClicked Hour', hour);
  }



  eventClicked(action: string, event: CalendarSchedulerEvent): void {
    console.log('eventClicked Action', action);
    console.log('eventClicked Event', event);
  }

  eventTimesChanged({ event, newStart, newEnd, type }: SchedulerEventTimesChangedEvent): void {
    console.log('eventTimesChanged Type', type);
    console.log('eventTimesChanged Event', event);
    console.log('eventTimesChanged New Times', newStart, newEnd);
    const ev: CalendarSchedulerEvent = this.events.find(e => e.id === event.id);
    ev.start = newStart;
    ev.end = newEnd;
    this.refresh.next();
  }
}
