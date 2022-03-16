import { Manufacturer } from './../models/manufacturer';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LazyRequest } from "../dto/lazy-request";
import { SearchResponse } from "../dto/search-response";



@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  CONFIGURATION_API = environment.api + '/manufacturers';

  constructor(private http: HttpClient) {
  }

  updateManufacturer(manufacturer) {
    return this.http.post<Manufacturer>(`${this.CONFIGURATION_API}`, manufacturer);
  }

  getLazyManufacturers(request: LazyRequest) {
    return this.http.post<SearchResponse<Manufacturer>>(`${this.CONFIGURATION_API}/filter`, request);
  }

  deleteManufacturer(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/${id}`, {observe: 'response'});
  }
/*
  getManufacturers(){
    return this.http.get<Manufacturer[]>(`${this.CONFIGURATION_API}/all`);
  }*/

}
