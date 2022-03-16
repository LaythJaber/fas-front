import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LoginConfiguration} from "../models/login-configuration";
import {CartConfiguration} from "../models/cart/cart-configuration";

@Injectable({
  providedIn: 'root'
})
export class CartConfigurationService {
  private readonly API = environment.api + '/carts-config';

  constructor(private http: HttpClient) {
  }

  update(request) {
    return this.http.post<void>(this.API, request);
  }

  getConfigurationBySellPoint(id: number) {
    return this.http.get<CartConfiguration>(`${this.API}/` + id);
  }

  getCartConfiguration() {
    return this.http.get<CartConfiguration>(`${this.API}`);
}
}
