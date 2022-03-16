import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PageType, WebPositioning} from "../models/seo/web-positioning";

@Injectable({
  providedIn: 'root'
})
export class WebPositioningService {
  private readonly API = environment.api + '/web-positioning';

  constructor(
    private http: HttpClient
  ) { }

  update(request) {
    return this.http.post<void>(this.API, request);
  }

  getCurrentEnterprisePageInfo(page: PageType) {
    return this.http.get<WebPositioning>(this.API + '/' + page);
  }


}
