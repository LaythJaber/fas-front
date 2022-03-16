import { Brand } from '../models/brand';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LazyRequest } from '../dto/lazy-request';
import { SearchResponse } from '../dto/search-response';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  CONFIGURATION_API = environment.api + '/brands';

  constructor(private http: HttpClient) {
  }

  updateBrand(brand) {
    return this.http.put<Brand>(`${this.CONFIGURATION_API}`, brand);
  }

  getLazyBrands(request: LazyRequest) {
    return this.http.post<SearchResponse<Brand>>(`${this.CONFIGURATION_API}`, request);
  }

  deleteBrand(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/${id}`, {observe: 'response'});
  }
}
