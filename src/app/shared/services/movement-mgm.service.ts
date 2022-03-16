import {Injectable} from '@angular/core';
import {SearchResponse} from '../dto/search-response';
import {environment} from '../../../environments/environment';
import {LazyRequest} from '../dto/lazy-request';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Movement} from '../models/movement';
import {MovementType} from '../enum/movement-type';
import {ProductStock} from '../models/product-stock';
import {Inventory} from '../models/Inventory';
import {MovementProduct} from '../models/movement-product';
import { Stock } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class MovementMgmService {

  MOVEMENT_API = environment.api + '/movements';

  constructor(private http: HttpClient) {
  }


  search(request) {
    return this.http.post<SearchResponse<Movement>>(`${this.MOVEMENT_API}/filter`, request);
  }

  create(movement: Movement) {
    return this.http.post<Movement>(`${this.MOVEMENT_API}`, movement);
  }

  update(movement: Movement) {
    return this.http.put<Movement>(`${this.MOVEMENT_API}/update`, movement);
  }

  updateInventory(inventory) {
    return this.http.put<Inventory>(`${this.MOVEMENT_API}/update-inventory`, inventory);
  }


  getNextNumber() {
    return this.http.get<number>(`${this.MOVEMENT_API}/get-next-number`);
  }


  getNextInventoryNumber() {
    return this.http.get<number>(`${this.MOVEMENT_API}/get-inventory-next-number`);
  }

  getProductsStock() {
    return this.http.get(`${this.MOVEMENT_API}/get-products-stock`);
  }

  getLazyProductStockList(request) {
    return this.http.post<SearchResponse<ProductStock>>(`${this.MOVEMENT_API}/get-products-stock`, request);
  }

  createInventory(request) {
    return this.http.post(`${this.MOVEMENT_API}/create-inventory`, request);
  }


  searchInventory(request) {
    return this.http.post<SearchResponse<Inventory>>(`${this.MOVEMENT_API}/filter-inventory`, request);
  }

  delete(id: number) {
    return this.http.delete(`${this.MOVEMENT_API}/${id}`, {observe: 'response'});
  }

  deleteInventory(id: number) {
    return this.http.delete(`${this.MOVEMENT_API}/delete-inventory/${id}`, {observe: 'response'});
  }

  getLazyStockList(request) {
    return this.http.post<SearchResponse<Stock>>(`${this.MOVEMENT_API}/get-stock`, request);
  }

  getStockHistoryByProduct(id) {
    return this.http.get<Stock>(`${this.MOVEMENT_API}/get-stock-history-by-product/${id}`);
  }

  effectPaymentMovements(id) {
    return this.http.get(`${this.MOVEMENT_API}/effect-payment-movements/${id}`);
  }

  readFromExcel() {
    return this.http.get<{ products: MovementProduct[], notFounded: string[] }>(`${this.MOVEMENT_API}/read-from-excel`);
  }

  findById(id: number) {
    return this.http.get<Movement>(`${this.MOVEMENT_API}/${id}`);
  }

  findInventoryById(id: number) {
    return this.http.get<Inventory>(`${this.MOVEMENT_API}/inventory/${id}`);
  }

  uploadProductsFromExcel(file) {
    return this.http.post<{
      products: MovementProduct[],
      notFounded: string[],
      rowException: number
    }>(`${this.MOVEMENT_API}/upload-from-excel`, file);
  }

  downloadExcelModel(lg) {
    const getfileheaders = new HttpHeaders().set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.get(`${this.MOVEMENT_API}/download-excel-model/${lg}`, {responseType: 'blob', headers: getfileheaders});
  }

  getValue(request){
    return this.http.post<number>(`${this.MOVEMENT_API}/value`, request);
  }
}


class MovementLazyRequest extends LazyRequest {
  number: string;
  dateFrom: Date;
  dateTo: Date;
  type?: MovementType;
}
