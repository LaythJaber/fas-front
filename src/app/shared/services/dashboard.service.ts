import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly DASH_API = environment.api + '/dashboard';
  constructor(private http: HttpClient) { }


  getInscriptionPerDay() {
    return this.http.get<number>(`${this.DASH_API}/inscription-per-dey`);
  }
  getPurchasePerDay() {
    return this.http.get<number>(`${this.DASH_API}/purchase-per-dey`);
  }
  getLastSyncState() {
    return this.http.get<boolean>(`${this.DASH_API}/last-sync-state`);
  }
}
