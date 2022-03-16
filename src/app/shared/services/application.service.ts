import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Application} from "../models/application.model";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  APP_API = environment.api + '/application';

  constructor(private http: HttpClient) {
  }


  update(request: Application) {
    return this.http.post<any>(`${this.APP_API}`, request);
  }

  getApplications() {
    return this.http.get<Application[]>(this.APP_API + '/all');
  }

  countApplications() {
    return this.http.get<number>(this.APP_API + '/count');
  }


  deleteApp(appId) {
    return this.http.delete<any>(`${this.APP_API}/${appId}`, {observe: 'response'});
  }

}
