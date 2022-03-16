import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

import {Account} from "../models/account.model";

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  API = environment.api + '/super-admins';

  constructor(private http: HttpClient) {
  }


  get() {
    return this.http.get<Account[]>(this.API);
  }

}
