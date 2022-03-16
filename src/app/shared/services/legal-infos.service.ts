import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {PagesInfo} from "../models/pages-info";

@Injectable({
  providedIn: 'root'
})
export class LegalInfosService {

  private readonly PUBLIC_API = environment.publicApi;

  constructor(
      private http: HttpClient
  ) { }

  getPagesInfo(){
    return this.http.get<PagesInfo>(`${this.PUBLIC_API}/pages/infos` );
  }
}
