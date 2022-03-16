import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {GeneralConfigurations} from "../models/general-configurations";

@Injectable({
  providedIn: 'root'
})
export class GeneralConfigurationsService {
  SITE_INFO_API = environment.api + '/general-configurations';

  constructor(
    private http: HttpClient
  ) { }

  updateGeneralConfigurations(request) {
    return this.http.post<GeneralConfigurations>(`${this.SITE_INFO_API}`, request);
  }

  getCurrentEnterpriseGeneralConfigurations() {
    return this.http.get<GeneralConfigurations>(`${this.SITE_INFO_API}`);
  }

  updateSellPointGeneralConfiguration(request) {
    return this.http.get<GeneralConfigurations>(`${this.SITE_INFO_API}/updateSellPoint/${request}`);
  }
}
