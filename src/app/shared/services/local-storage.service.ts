import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
  /*  private readonly CLIENT_DATA = 'client_data';
    private readonly AUTH_TOKEN = 'auth_token';*/
    private readonly SHOPCART = "shopCart";

    constructor() {
    }

  /*  set clientData(clientData: any) {
        localStorage.setItem(this.CLIENT_DATA, JSON.stringify(clientData));
    }

    get clientData() {
        return JSON.parse(localStorage.getItem(this.CLIENT_DATA));
    }

    set authToken(token: string) {
        localStorage.setItem(this.AUTH_TOKEN, JSON.stringify(token));
    }

    get authToken() {
        return JSON.parse(localStorage.getItem(this.AUTH_TOKEN));
    }*/

    get shopCart() {
        return JSON.parse(localStorage.getItem(this.SHOPCART));
    }

    set shopCart(shopCart: any) {
        localStorage.setItem(this.SHOPCART, JSON.stringify(shopCart));
    }

  /*  clearAll() {
        localStorage.removeItem(this.AUTH_TOKEN);
        localStorage.removeItem(this.CLIENT_DATA);
    }*/
}