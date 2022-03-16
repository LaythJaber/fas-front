import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class SmsConfigurationService {

  private readonly API = environment.api + '/sms-config';
  constructor(private http: HttpClient) { }

  updateConfig(request) {
    return this.http.post<void>(this.API, request);
  }

  getCurrentGroupConfig() {
    return this.http.get(this.API);
  }

  testAuth(request) {
    return this.http.post<boolean>(`${this.API}/auth`, request);
  }

}
