import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GroupConfiguration} from '../models/group-configuration';

@Injectable({
  providedIn: 'root'
})
export class GroupConfigurationService {
  GROUP_CONFIG_API = '/api/group-configuration';
  constructor(private http: HttpClient) { }

  update(request) {
    return this.http.post<void>(this.GROUP_CONFIG_API, request);
  }

  getCurrentGroupConfig() {
    return this.http.get<GroupConfiguration>(this.GROUP_CONFIG_API);
  }



}
