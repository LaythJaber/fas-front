import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PriceList} from "../models/price-list";
import {Page} from "../models/page";
import {Cookie} from "../models/cookie";

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  API = environment.api + '/cookies';

  constructor(private http: HttpClient) {
  }

  update(request) {
    return this.http.post<Cookie>(`${this.API}`, request);
  }

  get() {
    return this.http.get<Cookie>(this.API);
  }

}
