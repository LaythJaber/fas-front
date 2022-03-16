import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecoverPasswordService {
  API = environment.api;
  constructor(private http: HttpClient) { }

  recoverPassword(username) {
    return this.http.post<boolean>(this.API + '/forget-password', username);
  }

  changePassword(req: { password: any; token: string }) {
    return this.http.post(this.API + '/reset-password', req);
  }

  verifyResetPasswordKey(s: string) {
    return this.http.get<boolean>(this.API + '/verify-reset-password-token/' + s);
  }
}