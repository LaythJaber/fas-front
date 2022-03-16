import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LicenseConfigurationService {
  private API = environment.api + '/licenses-configurations';

  constructor(private http: HttpClient) { }

  save(request) {
    return this.http.post(this.API, request);
  }

  getLazyLicensesConfigurations(search) {
    return this.http.post<any[]>(this.API + '/filter', search);
  }

  delete(id: any) {
    return this.http.delete<void>(this.API + '/' + id);
  }

  getCurrentGroupMaxOperators() {
    return this.http.get<{maxOperators, countOperators}>(this.API + '/max-operators');
  }
  getCurrentGroupMaxCabins() {
    return this.http.get<{maxCabins, countCabins}>(this.API + '/max-cabins');
  }
}
