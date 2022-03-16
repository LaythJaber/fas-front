import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SmtpConfig} from "../models/smtp-config";

@Injectable({
  providedIn: 'root'
})
export class SmtpConfigurationService {

  private readonly API = environment.api + '/smtp-config';
  constructor(private http: HttpClient) { }

  updateConfig(request) {
    return this.http.post<void>(this.API, request);
  }

  getCurrentGroupConfig() {
    return this.http.get<SmtpConfig>(this.API);
  }

  testConnection(request){
    return this.http.post<string>(`${this.API}/test`, request); 
  }
}
