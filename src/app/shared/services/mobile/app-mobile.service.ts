import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AppMobileConfiguration} from "../../models/mobile/app-mobile-configuration";

@Injectable({
  providedIn: 'root'
})
export class AppMobileService {
  private PUBLIC_API = environment.publicApi + '/mobile-configurations';
  private PRIVATE_API = environment.api + '/mobile-configurations';

  constructor(
    private http: HttpClient,
  ) {
  }

  getCurrentAppMobileConfiguration() {
    return this.http.get<AppMobileConfiguration>(`${this.PRIVATE_API}`);
  }

  updateAppMobileConfiguration(request: AppMobileConfiguration) {
    return this.http.post<AppMobileConfiguration>(`${this.PRIVATE_API}`, request);
  }

}
