import { Manufacturer } from './../models/manufacturer';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LazyRequest } from "../dto/lazy-request";
import { SearchResponse } from "../dto/search-response";
import {Observable} from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class MeetService {
  API = environment.api + '/meet';

  constructor(private http: HttpClient) {
  }

  saveMeet(data): Observable<any> {
    return this.http.post(`${this.API}`, data);
  }


  setPwd(pwd, idMeet): Observable<any> {
    return this.http.post(`${this.API}/set-pwd/${idMeet}`, pwd);
  }

  resetPwd(idMeet): Observable<any> {
    return this.http.get(`${this.API}/set-pwd/${idMeet}`);
  }


  getMeetingByUser(id: number): Observable<any> {
    return this.http.get(`${this.API}/user-meet/${id}`);
  }

  getMeetByCurrentUser(): Observable<any> {
    return this.http.get(`${this.API}/user-meet`);
  }

}
