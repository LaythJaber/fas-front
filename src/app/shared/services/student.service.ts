import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Account} from "../models/account.model";
import {Student} from "../models/student";
import {Application} from "../models/application.model";
import {UserApplications} from "../models/user-applications";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  readonly API = environment.api + '/student';

  constructor(
    private http: HttpClient
  ) {}

/*
  getAllShipmentList() {
    return this.http.get<Shipment[]>(`${this.API}/list`);
  }

  getLazyShipment(request: ShipmentPageRequest) {
    return this.http.post<SearchResponse<Shipment>>(`${this.API}/filter`, request);
  }

  save(student: any) {
    return this.http.post(`${this.API}`, student);
  }

  updateShipment(shipment: Shipment) {
    return this.http.put(`${this.API}`, shipment);
  }

  deleteShipment(shipmentId: number) {
    return this.http.delete(`${this.API}/${shipmentId}`, {observe: 'response'});
  }

  changeShipmentStatus(shipmentId: number) {
    return this.http.put(`${this.API}/status/${shipmentId}`, {observe: 'response'});
  }



  */


  getStudents() {
    return this.http.get<Student[]>(`${this.API}`);
  }

  countStudents() {
    return this.http.get<number>(this.API + '/count');
  }

  countAcceptedStudents() {
    return this.http.get<number>(this.API + '/count-accepted');
  }

  countAcceptedApplicationsByUser() {
    return this.http.get<number>(this.API + '/count-accepted-applications');
  }

  countTotalApplicationsByUser() {
    return this.http.get<number>(this.API + '/count-total-applications');
  }

  countRejectedApplicationsByUser() {
    return this.http.get<number>(this.API + '/count-rejected-applications');
  }


  getStudentDetails(studentId: number) {
    return this.http.get<Account>(`${this.API}/${studentId}`);
  }

  assignApp(userId, appId) {
    return this.http.get<UserApplications>(`${this.API}/assign/${userId}/${appId}`);
  }

  detachApp(userId, appId) {
    return this.http.get<any>(`${this.API}/detach/${userId}/${appId}`,{observe: 'response'});
  }


  changeApplicationStatus(userId, appId) {
    return this.http.put(`${this.API}/toggle-app-status/${userId}/${appId}`, {}, {observe: 'response'});
  }

  updateApplicationNote(userId, appId, note) {
    return this.http.put(`${this.API}/app-note/${userId}/${appId}/${note}`, {}, {observe: 'response'});
  }

  changeAccountStatus(userId) {
    return this.http.put(`${this.API}/toggle-account-status/${userId}`, {}, {observe: 'response'});
  }

  getStudentApplications() {
    return this.http.get<UserApplications[]>(`${this.API}/applications`);
  }

}
