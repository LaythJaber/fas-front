import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Provider } from '../models/provider';
import { SearchResponse } from '../dto/search-response';
import { LazyRequest } from '../dto/lazy-request';

@Injectable({
  providedIn: 'root'
})

export class ProviderMgmService {
  PROVIDER_API = environment.api + '/providers';

  constructor(private http: HttpClient) {
  }

  addNewProvider(provider: Provider) {
    return this.http.post<Provider>(`${this.PROVIDER_API}`, provider);
  }

  editProvider(provider: Provider) {
    return this.http.put<Provider>(`${this.PROVIDER_API}`, provider);
  }

  getAllProviders() {
    return this.http.get<Provider[]>(`${this.PROVIDER_API}`);
  }

  deleteProvider(providerId) {
    return this.http.delete(`${this.PROVIDER_API}/${providerId}`, {observe: 'response'});
  }

  getLazyProviderList(request) {
    return this.http.post<SearchResponse<Provider>>(`${this.PROVIDER_API}/filter`, request);
  }

  changeProviderVisibleState(providerId) {
    return this.http.put(`${this.PROVIDER_API}/visible-state/${providerId}`, {}, {observe: 'response'});
  }

  isBusinessNameUnique(request: Provider) {
    return this.http.post<boolean>(`${this.PROVIDER_API}/is-businessname-unique`, request);
  }

}

class ProviderLazyRequest extends LazyRequest {
  textSearch: string;
  visible?: boolean;
}
