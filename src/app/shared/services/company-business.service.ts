import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyBusinessService {
  private API = environment.api + '/company-businesses';

  constructor(private http: HttpClient) {}

  getAllCompanyBusinesses() {
    return this.http.get<any>(this.API);
  }

  update(req: any) {
    return this.http.post<any>(this.API, req);
  }

  delete(id: any) {
    return this.http.delete<any>(this.API + '/' + id);
  }
}
