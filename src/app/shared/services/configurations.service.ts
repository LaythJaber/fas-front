import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SearchResponse} from '../dto/search-response';
import {IvaCode} from '../models/iva-code';
import {PaymentType} from '../models/payment-type';
import {LazyRequest} from '../dto/lazy-request';
import {Linea} from '../models/linea';
import {Category} from '../models/category';
import {SubCategory} from '../models/sub-category';
import { Reparto } from '../models/reparto';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  CONFIGURATION_API = environment.api + '/configurations';

  constructor(private http: HttpClient) {
  }

  /****
   * Codice IVA
   */
  addNewIvaCode(ivaCode) {
    return this.http.post<IvaCode>(`${this.CONFIGURATION_API}/iva-code`, ivaCode);
  }

  lazyIvaCode(request) {
    return this.http.post<SearchResponse<IvaCode>>(`${this.CONFIGURATION_API}/iva-code/filter`, request);
  }

  editIvaCode(request) {
    return this.http.put<IvaCode>(`${this.CONFIGURATION_API}/iva-code`, request);
  }

  deleteIvaCode(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/iva-code/${id}`, {observe: 'response'});
  }

  getAllIvaCode(rtConfigId) {
    return this.http.get<IvaCode[]>(`${this.CONFIGURATION_API}/get-all-iva-code/${rtConfigId}`);
  }


  /**
   * Payment type
   */

  addNewPaymentType(paymentType) {
    return this.http.post<PaymentType>(`${this.CONFIGURATION_API}/payment-types`, paymentType);
  }

  getLazyPaymentType(request: LazyRequest) {
    return this.http.post<SearchResponse<PaymentType>>(`${this.CONFIGURATION_API}/payment-types/filter`, request);
  }

  editPaymentType(request) {
    return this.http.put<PaymentType>(`${this.CONFIGURATION_API}/payment-types`, request);
  }

  deletePaymentType(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/payment-types/${id}`, {observe: 'response'});
  }

  getPaymentTypes() {
    return this.http.get<PaymentType[]>(`${this.CONFIGURATION_API}/payment-types`);
  }



  /**
   * lineas
   */
  addNewLinea(linea) {
    return this.http.post<Linea>(`${this.CONFIGURATION_API}/lineas`, linea);
  }

  getLazyLineas(request: LazyRequest) {
    return this.http.post<SearchResponse<Linea>>(`${this.CONFIGURATION_API}/lineas/filter`, request);
  }

  editLinea(request) {
    return this.http.put<Linea>(`${this.CONFIGURATION_API}/lineas`, request);
  }

  deleteLinea(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/lineas/${id}`, {observe: 'response'});
  }

    /**
   * Reparto
   */
  addNewReparto(reparto) {
    return this.http.post<Reparto>(`${this.CONFIGURATION_API}/repartos`, reparto);
  }

  getLazyRepartos(request: LazyRequest) {
    return this.http.post<SearchResponse<Reparto>>(`${this.CONFIGURATION_API}/repartos/filter`, request);
  }

  editReparto(request) {
    return this.http.put<Reparto>(`${this.CONFIGURATION_API}/repartos`, request);
  }

  deleteReparto(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/repartos/${id}`, {observe: 'response'});
  }


  /**
   * category-product
   */
  addNewCategory(category) {
    return this.http.post<Category>(`${this.CONFIGURATION_API}/categories`, category);
  }

  getLazyCategories(request: LazyRequest) {
    return this.http.post<SearchResponse<Category>>(`${this.CONFIGURATION_API}/categories/filter`, request);
  }

  editCategory(request) {
    return this.http.put<Category>(`${this.CONFIGURATION_API}/categories`, request);
  }

  deleteCategory(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/categories/${id}`, {observe: 'response'});
  }


/**
   * sub category-product
   */
  addNewSubCategory(subCategory) {
    return this.http.post<SubCategory>(`${this.CONFIGURATION_API}/sub-categories`, subCategory);
  }

  getLazySubCategories(request: LazyRequest) {
    return this.http.post<SearchResponse<SubCategory>>(`${this.CONFIGURATION_API}/sub-categories/filter`, request);
  }

  editSubCategory(request) {
    return this.http.put<SubCategory>(`${this.CONFIGURATION_API}/sub-categories`, request);
  }

  deleteSubCategory(id) {
    return this.http.delete(`${this.CONFIGURATION_API}/sub-categories/${id}`, {observe: 'response'});
  }

  getSubCategoriesByCategoryid(id) {
    return this.http.post<SubCategory[]>(`${this.CONFIGURATION_API}/sub-categories-by-category-id`, id);

  }


}
