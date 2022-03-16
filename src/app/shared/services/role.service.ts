import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {Role} from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  API = environment.api + '/roles';

  constructor(private http: HttpClient) {
  }

  addRole(role) {
    return this.http.post<Role>(`${this.API}`, role, {observe: 'response'});
  }

  getAllRoles() {
    return this.http.get<Role[]>(`${this.API}`);
  }

  getRoleById(id: any) {
    return this.http.get<Role>(`${this.API}/${id}`);
  }

  editRole(role: any) {
    return this.http.put<Role>(`${this.API}`, role, {observe: 'response'});
  }

  deleteRole(roleId) {
    return this.http.delete(`${this.API}/${roleId}`, {observe: 'response'});
  }
}
