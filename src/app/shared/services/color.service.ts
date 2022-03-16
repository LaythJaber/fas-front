import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Color} from '../models/color';
import {LazyRequest} from '../dto/lazy-request';
import {SearchResponse} from '../dto/search-response';


@Injectable({
  providedIn: 'root'
})
export class ColorService {
  COLOR_API = environment.api + '/colors';

  constructor(private http: HttpClient) {
  }

  updateColor(color) {
    return this.http.put<Color>(`${this.COLOR_API}`, color);
  }

  toggleColorState(colorId: number) {
    return this.http.put(`${this.COLOR_API}/state`, colorId, {observe: "response"});
  }

  getLazyColors(request: LazyRequest) {
    return this.http.post<SearchResponse<Color>>(`${this.COLOR_API}`, request);
  }

  deleteColor(id) {
    return this.http.delete(`${this.COLOR_API}/${id}`, {observe: 'response'});
  }
}
