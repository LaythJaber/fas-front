import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LazyRequest } from '../dto/lazy-request';
import { SearchResponse } from '../dto/search-response';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  CONFIGURATION_API = environment.api + '/tags';

  constructor(private http: HttpClient) {
  }

  updateTag(formData: FormData) {
    return this.http.put<Tag>(`${this.CONFIGURATION_API}`, formData);
  }

  getLazyTags(request: LazyRequest) {
    return this.http.post<SearchResponse<Tag>>(`${this.CONFIGURATION_API}`, request);
  }

  deleteTag(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/${id}`, {observe: 'response'});
  }



}
