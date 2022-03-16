import {ProductStock} from './../models/product-stock';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SearchResponse} from '../dto/search-response';
import {LazyRequest} from '../dto/lazy-request';
import {Product} from '../models/product';
import {StockHistory} from '../models/stock-history';
import {ProductResources} from '../models/product-resources';
import {ProductCode} from "../models/product-code";

@Injectable({
  providedIn: 'root'
})
export class ProductMgmService {

  PRODUCT_API = environment.api + '/products';

  constructor(private http: HttpClient) {
  }

  addNewProduct(request: Product) {
    return this.http.post<Product>(`${this.PRODUCT_API}`, request);
  }

  editProduct(request: Product) {
    return this.http.put<Product>(`${this.PRODUCT_API}`, request);
  }


  deleteProduct(productId) {
    return this.http.delete(`${this.PRODUCT_API}/${productId}`, {observe: 'response'});
  }


  getLazyProductList(request: ProductLazyRequest) {
    return this.http.post<SearchResponse<Product>>(`${this.PRODUCT_API}/filter`, request);
  }

  searchIncludingDescriptionsAndCodes(request: LazyRequest) {
    return this.http.post<SearchResponse<Product>>(`${this.PRODUCT_API}/search`, request);
  }


  delete(id: number) {
    return this.http.delete(`${this.PRODUCT_API}/${id}`, {observe: 'response'});
  }

  getTicket() {
    return this.http.get(`${this.PRODUCT_API}/get-products-ticket`, {observe: 'response', responseType: 'blob'});
  }

  printTicket(request) {
    return this.http.post(`${this.PRODUCT_API}/print-products-ticket`, request, {observe: 'response', responseType: 'blob'});
  }

  printFacePlates(request) {
    return this.http.post(`${this.PRODUCT_API}/print-products-face-plates`, request, {observe: 'response', responseType: 'blob'});
  }


  findByBarCode(ean) {
    return this.http.get<Product>(`${this.PRODUCT_API}/find-by-barcode/${ean}`);
  }

  getById(id) {
    return this.http.get<Product>(`${this.PRODUCT_API}/${id}`);
  }

  getHistoryById(id) {
    return this.http.post<StockHistory[]>(`${this.PRODUCT_API}/history`, id);
  }

  editProductActiveSale(id) {
    return this.http.post<Product>(`${this.PRODUCT_API}/active-sale`, id);
  }

  editProductStatus(id) {
    return this.http.post<Product>(`${this.PRODUCT_API}/enabled`, id);
  }

  changeInEvidenzaState(productId: number) {
    return this.http.put(`${this.PRODUCT_API}/in-evidenza/${productId}`, {});
  }

  getImages(request) {
    return this.http.post<ProductResources[]>(`${this.PRODUCT_API}/get-images`, request);
  }

  addEanCode(productId: number, ean: string) {
    return this.http.put<ProductCode[]>(`${this.PRODUCT_API}/add-ean-code/${productId}`, ean, {observe: "response"});
  }

  
  getProductDetails(productId: number) {
    return this.http.get<Product>(`${this.PRODUCT_API}/` + productId).toPromise();
  }
}


export class ProductLazyRequest extends LazyRequest {
  subCategoryId?: number;
  categoryId?: number;
  inEvidenza?: boolean;
  disabled?: boolean;
  brandId?: number;
  stockZero?: boolean;
  priceZero?: boolean;
  inPromo?: boolean;
  manufacturerId?: number;
}
