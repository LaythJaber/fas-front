import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PriceList} from "../models/price-list";
import {Page} from "../models/page";

@Injectable({
  providedIn: 'root'
})
export class Page3Service {

  API = environment.api + '/page-3';

  constructor(private http: HttpClient) {
  }

  update(request) {
    return this.http.post<Page>(`${this.API}`, request);
  }

  get() {
    return this.http.get<Page>(this.API);
  }

}
