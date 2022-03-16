import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ZipCode } from '../models/zip-code';
import { environment } from '../../../environments/environment';
import {LazyRequest} from "../dto/lazy-request";
import {SearchResponse} from "../dto/search-response";
import {map} from "rxjs/operators";
import {SellPoint} from '../models/sell-point';

@Injectable({
  providedIn: 'root'
})
export class ZipCodeService {

  private API = `${environment.api}/zip-codes`;

  constructor(private http: HttpClient) { }

  getAllZipCodesByCountry(country) {
    return this.http.get<ZipCode[]>(`${this.API}/${country}`);
  }

  getFilteredZipCodes(request: ZipCodePageRequest) {
    return this.http.post<SearchResponse<ZipCode>>(`${this.API}/filter`, request);
  }

  getProvincesByCountry(country: string) {
    return this.http.get<string[]>(`${this.API}/provinces?country=${country}`);
  }

  enableAllSelected(zipCodeIds: number[], status: boolean) {
    return this.http.put<any>(`${this.API}/enable/list?status=${status}`, zipCodeIds, {observe: "response"});
  }

  enableAllFiltered(request: ZipCodePageRequest, status: boolean) {
    return this.http.put<any>(`${this.API}/enable/filter?status=${status}`, request, {observe: "response"});
  }

  enableOne(zipCodeId: number) {
    return this.http.put<any>(`${this.API}/enable/one`, zipCodeId, {observe: "response"});
  }

  deleteZipCode(zipCodeId: number) {
    return this.http.delete<any>(`${this.API}/${zipCodeId}`, {observe: "response"});
  }


  filterCapsAssociated(sellpoint) {
    return this.http.post<ZipCode[]>(`${this.API}/filterBySellpoint`, sellpoint);
  }

  editCaps(sellPoint) {
    return this.http.post<SellPoint>(`${this.API}/updateCaps`, sellPoint);
  }
}

export class ZipCodePageRequest extends LazyRequest {
  country: string = '';
  province: string = '';
  enabled: number = -1;
  sellPointId: number ;
}
