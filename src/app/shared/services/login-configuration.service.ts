import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LoginConfiguration} from "../models/login-configuration";

@Injectable({
  providedIn: 'root'
})
export class LoginConfigurationService {
  private readonly API = environment.api + '/login-configuration';

  constructor(private http: HttpClient) {
  }

  update(request) {
    return this.http.post<void>(this.API, request);
  }

  getCurrentGroupConfig() {
    return this.http.get<any>(this.API);
  }
}
