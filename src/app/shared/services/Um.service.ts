import {Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';
import { LazyRequest } from '../dto/lazy-request';
import { SearchResponse } from '../dto/search-response';
import { HttpClient } from '@angular/common/http';
import { Um } from '../models/um';

@Injectable({
  providedIn: 'root'
})
export class UmService {

  UM_API = environment.api + '/um';

  constructor(private http: HttpClient) {}

  update(um: Um) {
    return this.http.put<any>(`${this.UM_API}`, um);
  }

  getAllLazy(request: LazyRequest) {
    return this.http.post<SearchResponse<Um>>(`${this.UM_API}`, request);
  }

  getAll() {
    return this.http.get<Um[]>(`${this.UM_API}`);
  }

  deleteUm(id) {
    return this.http.delete(`${this.UM_API}/${id}`, {observe: 'response'});
  }
}
