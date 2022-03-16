import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LazyRequest } from "../dto/lazy-request";
import { SearchResponse } from "../dto/search-response";
import { Language } from "../models/language";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  CONFIGURATION_API = environment.api + '/languages';

  constructor(private http: HttpClient) {
  }

  updateLanguage(language) {
    return this.http.put<Language>(`${this.CONFIGURATION_API}`, language);
  }

  getLazyLanguages(request: LazyRequest) {
    return this.http.post<SearchResponse<Language>>(`${this.CONFIGURATION_API}`, request);
  }

  deleteLanguage(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/${id}`, {observe: 'response'});
  }

  getLanguages(){
    return this.http.get<Language[]>(`${this.CONFIGURATION_API}/all`);
  }


}
