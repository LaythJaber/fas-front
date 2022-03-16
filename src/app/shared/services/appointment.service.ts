import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Appointment} from "../models/appointment";
import {SellPoint} from "../models/sell-point";
import {map} from "rxjs/operators";
import {CalendarSchedulerEvent} from "angular-calendar-scheduler";
import {addHours} from "date-fns";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  APP_API = environment.api + '/appointment';


  constructor(private http: HttpClient) {
  }


  update(request: Appointment) {
    return this.http.post<Appointment>(`${this.APP_API}`, request);
  }

  getAppointments() {
    return this.http.get<Appointment[]>(this.APP_API );
  }


  deleteAppointment(id) {
    return this.http.delete<any>(`${this.APP_API}/${id}`, {observe: 'response'});
  }



}
