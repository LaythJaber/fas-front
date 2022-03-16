import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ClientPageRequest} from '../dto/client-page-request';
import {Observable} from 'rxjs';
import {Client} from '../models/client';
import {Address} from '../models/address';
import {LazyRequest} from '../dto/lazy-request';
import {SearchResponse} from '../dto/search-response';
import {Product} from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ClientMgmService {

  CLIENT_API = environment.api + '/clients';
  WISH_API = environment.publicApi + '/wishs';

  constructor(private http: HttpClient) {
  }

  getClients(request: ClientPageRequest) {
    return this.http.post<SearchResponse<Client>>(this.CLIENT_API + '/client-list', request);
  }

  getClientAddresses(id: number): Observable<any> {
    return this.http.get<any>(this.CLIENT_API + '/client-addresses/' + id);
  }

  addClient(client): Observable<Client> {
    return this.http.post<Client>(this.CLIENT_API, client);
  }

  addClientAddress(address, clientId): Observable<Address> {
    return this.http.post<Address>(this.CLIENT_API + '/client-addresses/' + clientId, address);
  }

  updateMainAddress(addressId, clientId): Observable<Address> {
    return this.http.put<Address>(this.CLIENT_API + '/main-address/' + addressId + '/' + clientId, {id: addressId});
  }

  updateAddress(address): Observable<Address> {
    return this.http.put<Address>(this.CLIENT_API + '/addresses', address);
  }


  deleteAddress(addressId): Observable<any> {
    return this.http.delete<any>(this.CLIENT_API + '/addresses/' + addressId);
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(this.CLIENT_API + '/client', client);
  }

  changeClientBlockStatus(clientId: number) {
    return this.http.put(`${this.CLIENT_API}/block/${clientId}`, {}, {observe: 'response'});
  }

  deleteClient(clientId: number) {
    return this.http.post(`${this.CLIENT_API}/cancel`, {clientId: clientId, operator: 'OPERATOR', password: null}, {observe: 'response'});
  }

  confirmClient(clientId: number) {
    return this.http.put(`${this.CLIENT_API}/confirm/${clientId}`, {}, {observe: 'response'});
  }

  changeClientPassword(cId: number, npsd: string) {
    return this.http.put(`${this.CLIENT_API}/client-password`, {clientId: cId, newPassword: npsd}, {observe: 'response'});
  }

  getWishListByClient(request: LazyRequest, clientId: number) {
    const hds = {
      'clientId': clientId.toString()
    };
    return this.http.post<SearchResponse<Product>>(`${this.WISH_API}/client-wish`, request,
      {headers: hds}).toPromise();
  }

  getClientsByIds(request) {
    return this.http.post<Client[]>(`${this.CLIENT_API}/get-clients-by-ids`, request);
  }


  countReceivers() {
    return this.http.get<number[]>(`${this.CLIENT_API}/count-promo-receivers`);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<Client>(this.CLIENT_API + '/' + id);
  }

}
