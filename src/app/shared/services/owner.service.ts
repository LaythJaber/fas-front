import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Group, GroupWithSuperAdmins} from '../models/group';
import {Operator} from '../models/operator';
import {SuperAdmin} from '../models/super-admin';
import {AuthResponse} from '../models/auth-response';
import {SearchResponse} from '../dto/search-response';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  readonly API = environment.api;

  constructor(private http: HttpClient) {
  }

  getAllGroups(request) {
    return this.http.post<GroupWithSuperAdmins[]>(`${this.API}/groups/filter`, request);
  }

  lazySearch(request) {
    return this.http.post<SearchResponse<GroupWithSuperAdmins>>(`${this.API}/groups/lazy-search`, request);
  }



  getSuperAdminsByGroup(groupId) {
    return this.http.get<Operator[]>(`${this.API}/groups/${groupId}/super-admins`);
  }



  getSuperAdmins() {
    return this.http.get<SearchResponse<GroupWithSuperAdmins>>(`${this.API}/super-admins`);
  }

  getGroupById(groupId: any) {
    return this.http.get<Group>(`${this.API}/groups/${groupId}`);
  }

  getCurrentGroup() {
    return this.http.get<Group>(`${this.API}/groups`);
  }

  setGroupAuthorities(request: { groupId: number, features: string[] }) {
    return this.http.post<Group>(`${this.API}/groups/authorities`, request);
  }

  addGroup(request) {
    return this.http.post<Group>(`${this.API}/groups/`, request);
  }

  getAllSuperAdmins() {
    return this.http.get<SuperAdmin[]>(`${this.API}/super-admins`);
  }

  getAvailableSuperAdmin(groupId) {
    return this.http.get<SuperAdmin[]>(`${this.API}/super-admins/available/${groupId}`);
  }

  addOrUpdateSuperAdmin(request) {
    return this.http.post<any>(`${this.API}/super-admins`, request);
  }

  deleteSuperAdmin(id) {
    return this.http.delete(`${this.API}/super-admins/${id}`);
  }

  linkSuperAdminsToGroup(groupId: number, ids: number[]) {
    return this.http.post<any>(`${this.API}/super-admins/link/${groupId}`, ids);
  }

  deleteGroup(id: number) {
    return this.http.delete<any>(`${this.API}/groups/${id}`);
  }

  updateGroup(request) {
    return this.http.put<any>(`${this.API}/groups`, request);
  }

  toggleGroupActivation(id: number) {
    return this.http.put<any>(`${this.API}/groups/toggle/${id}`, {});
  }

  chooseGroup(id: number) {
    return this.http.post<AuthResponse>(`${this.API}/auth/group`, id);
  }

  editGroupValidationDate(request: any) {
    return this.http.put<any>(`${this.API}/groups/date`, request);
  }

  saveConfiguration(request: any) {
    return this.http.post<Group>(`/api/groups/configuration`, request);
  }

  getCurrentGroupLicenseModules() {
    return this.http.get<any>(`${this.API}/groups/current-license-config`).pipe(map(el => {
      if (el) {
        return el.authorities.filter(u => u !== 'ADMINISTRATION');
      }
    }));
  }
}
