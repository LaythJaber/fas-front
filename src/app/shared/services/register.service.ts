import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private API = environment.api;

  constructor(private http: HttpClient) { }

  register(request) {
    return this.http.post<boolean>(this.API + '/register', request);
  }

  verifyMailKey(key: string) {
    return this.http.get<boolean>(this.API + '/is-mail-key-valid/' + key);
  }

  initAccount(request) {
    return this.http.post<{success: boolean, username: string}>(this.API + '/init-account', request);
  }

}
