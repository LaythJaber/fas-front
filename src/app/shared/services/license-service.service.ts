import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LicenseServiceService {
  core;

  constructor(private http: HttpClient) {
  }

  isAutorizedLicense() {
    if (this.core) {
      return this.core.success === true;
    }
    return false;
  }

  refresh(core) {
    this.core = core;
  }

  isModuleAuthorized(module: string): number {
    return this.core.productRestrictions[0].modules.some(u => u.code.toUpperCase() === module.toUpperCase());
    //  return this.core.productRestrictions[0].modules.indexOf(module);
  }

  idRestrictionModule(): boolean {
    return this.core.productRestrictions[0].restrictionModule;
  }

  /*getGroup() {
    return this.http.get<any>(`/api/private/groups`);
  }*/

  getGroup(id: number) {
    return this.http.get<any>(`/api/private/groups/${id}`);
  }

}
