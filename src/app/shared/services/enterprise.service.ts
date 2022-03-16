import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { Enterprise } from '../models/enterprise';
import {ImportEnterpriseConfig} from '../models/import-enterprise-config';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  readonly API = environment.api + '/enterprises';
  constructor(private http: HttpClient) { }

  addNewEnterprise(enterprise) {
    return this.http.post<Enterprise>(`${this.API}`, enterprise);
  }

  getAllEnterprises() {
    return this.http.get<Enterprise[]>(`${this.API}`);
  }

  editEnterprise(enterprise) {
    return this.http.put<Enterprise>(`${this.API}`, enterprise);
  }

  getEnterpriseById(enterpriseId) {
    return this.http.get<Enterprise>(`${this.API}/${enterpriseId}`);
  }

  deleteEnterprise(id: any) {
    return this.http.delete<void>(`${this.API}/${id}`);
  }


}
