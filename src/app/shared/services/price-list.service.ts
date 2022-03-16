import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LazyRequest } from 'src/app/shared/dto/lazy-request';
import { SearchResponse } from 'src/app/shared/dto/search-response';
import { PriceList } from 'src/app/shared/models/price-list';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  PRICE_API = environment.api + '/price-list';

  constructor(private http: HttpClient) {
  }

  updatePrice(request) {
    return this.http.post<PriceList>(`${this.PRICE_API}`, request);
  }

  getByProductId(request) {
    return this.http.post<PriceList>(`${this.PRICE_API}/product`, request);
  }


  searchPriceList(request: LazyRequest) {
    return this.http.post<SearchResponse<PriceList>>(`${this.PRICE_API}/filter`, request);
  }

  delete(id: number) {
    return this.http.delete(`${this.PRICE_API}/${id}`, {observe: 'response'});
  }

  applyCriteria(request) {
    return this.http.post<any>(`${this.PRICE_API}/apply-criteria`, request);
  }

  findPriceListByProductId(request){
    return this.http.post<PriceList>(`${this.PRICE_API}/search`, request);
  }

}

