import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Application} from "../models/application.model";
import {Ds} from "../models/ds";

@Injectable({
  providedIn: 'root'
})
export class DsService {

  APP_API = environment.api + '/ds';

  constructor(private http: HttpClient) {
  }


  updateDs(request: Ds) {
    return this.http.post<any>(`${this.APP_API}`, request);
  }

  getDs() {
    return this.http.get<Ds>(this.APP_API );
  }


}
