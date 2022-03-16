import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Size} from '../models/size';
import {LazyRequest} from '../dto/lazy-request';
import {SearchResponse} from '../dto/search-response';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  SIZE_API = environment.api + '/sizes';

  constructor(private http: HttpClient) {
  }

  updateSize(size) {
    return this.http.put<Size>(`${this.SIZE_API}`, size);
  }

  toggleSizeState(sizeId: number) {
    return this.http.put(`${this.SIZE_API}/state`, sizeId, {observe: "response"});
  }

  getLazySizes(request: LazyRequest) {
    return this.http.post<SearchResponse<Size>>(`${this.SIZE_API}`, request);
  }

  deleteSize(id) {
    return this.http.delete(`${this.SIZE_API}/${id}`, {observe: 'response'});
  }
}
