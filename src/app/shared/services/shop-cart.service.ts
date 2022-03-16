import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { SearchResponse } from "../dto/search-response";
import { CartPageRequest } from "../dto/cart-page-request";
import { ShopCart } from "../models/shop-cart";
import { CartRequest } from "../dto/cart-request";
import { BehaviorSubject } from "rxjs";
import { ProductMgmService } from "./product-mgm.service";
import { PriceService } from "./price-service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from 'ngx-toastr';
import { ShopCartRow } from "../models/shop-cart-row";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class ShopCartService {
  CART_API = environment.publicApi + '/carts';
  CART_PRIVATE_API = environment.publicApi + '/private/carts';
  private request: CartRequest;

  public cart$ = new BehaviorSubject<ShopCart>(null);
  state = this.cart$.asObservable();
  productNumber = new BehaviorSubject<number>(0);

  public productsNumberSource: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  productsNumber = this.productsNumberSource.asObservable();

  constructor(private http: HttpClient, private productService: ProductMgmService,
    private localStorageService: LocalStorageService,
    private priceService: PriceService,
    private toastrService: ToastrService,
    private translate: TranslateService) { }

  searchCarts(request: CartPageRequest) {
    return this.http.post<SearchResponse<ShopCart>>(this.CART_PRIVATE_API + "/list", request);
  }

  getShopCartByClient(id: number) {
    return this.http.get<ShopCart>(`${this.CART_API}/` + id);
  }

  findRows(id: string) {
    return this.http.get<any>(`${this.CART_PRIVATE_API}/find-rows/` + id)
  }

  addProductToCart(request: CartRequest) {
    return this.http.post<any>(`${this.CART_PRIVATE_API}/add-product-from-bo`, request);
  }

  updateCart(data: ShopCart) {
    return this.http.post<any>(`${this.CART_PRIVATE_API}/update-cart`, data);
  }

  updateNumber(productsNumber: number) {
    this.productsNumberSource.next(productsNumber);
  }

  deleteCart(id: string) {
    return this.http.get<void>(`${this.CART_API}/delete-cart/` + id);
  }

  public incQuantity(id: number, user: any, colorId: number, sizeId: number, quantity: number = 1) {
  //  if (user !== null) {
      this.request = {
        clientId: user.clientId,
        productId: id,
        quantity,
        colorId,
        sizeId
      };
      console.log('request = ', this.request);
     return  this.addProductToCart(this.request);
  }


  changeCart(cart: ShopCart) {
    this.cart$.next(cart);
    this.productNumber.next(cart ? cart.productsNumber : 0);
    this.localStorageService.shopCart = cart;
  }

  public decQuantity(id: number, user: any, colorId: number, sizeId: number, quantity: number = 1) {
      this.request = {
        clientId: user.clientId,
        productId: id,
        quantity,
        colorId,
        sizeId
      };
      return this.reduceProductFromCart(this.request);
  }

/*  reduceProductFromCart(request: CartRequest) {
    return this.http.post<any>(`${this.CART_API}/reduce-product-from-cart`, request);
}*/

reduceProductFromCart(request: CartRequest) {
  return this.http.post<any>(`${this.CART_PRIVATE_API}/reduce-product-from-bo`, request);
}



toggleRowReplaceable(rowId, state: boolean, clientId: number) {
  return this.http.put<any>(`${this.CART_PRIVATE_API}/row-replaceable`, {id: rowId, replaceable: state, clientId: clientId}, {observe: 'response'});
}

}
