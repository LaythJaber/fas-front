import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SellPoint } from '../models/sell-point';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class SellPointService {
  readonly API = environment.api + '/sell-points';

  constructor(private http: HttpClient) {
  }

  addSellPoint(sellPoint, enterpriseId) {
    console.log('in ---');
    sellPoint.startHour = this.fixTimeFormat(sellPoint.startHour);
    sellPoint.finishHour = this.fixTimeFormat(sellPoint.finishHour);
    return this.http.post<SellPoint>(`${this.API}`, { ...sellPoint, enterpriseId });
  }

  getAllSellPoints() {
    return this.http.get<SellPoint[]>(`${this.API}`).pipe(map(el => {
      return el.map(u => {
        u.enterpriseName = u.enterprise.companyName;
        return u;
      });
    }));
  }

  getSellPointsByEnterprise(id) {
    return this.http.get<SellPoint[]>(`${this.API}/enterprise/${id}`);
  }

  private fixTimeFormat(time: Date) {
    let hours = '' + time.getHours();
    let minutes = '' + time.getMinutes();
    if (time.getHours() < 10) {
      hours = '0' + hours;
    }
    if (time.getMinutes() < 10) {
      minutes = '0' + minutes;
    }
    return [hours, minutes].join(':');
  }

  editSellPoint(sellPoint) {
    sellPoint.startHour = this.fixTimeFormat(sellPoint.startHour);
    sellPoint.finishHour = this.fixTimeFormat(sellPoint.finishHour);
    return this.http.put<SellPoint>(`${this.API}`, sellPoint);
  }

  getSellPointsFromAccount(header?: HttpHeaders) {
    return this.http.get<ChooseSellPointResponse>(`${this.API}/account`, { headers: header });
  }

  getSellPointsFromGroup(header?: HttpHeaders) {
    return this.http.get<ChooseSellPointResponse>(`${this.API}/group`, { headers: header });
  }

  getWorkTime() {
    return this.http.get<{ startHour: string, finishHour: string }>(`${this.API}/get-work-time`);
  }

  getCurrentSellPoint() {
    return this.http.get<SellPoint>(`${this.API}/current-sell-point`);
  }

  deleteSellPoint(id: number) {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  chooseSellPoint(id) {
    return this.http.post<AuthResponse>(environment.api + '/auth/sell-point', id);
  }

  getSellPointsFromAccountAndAdmin(header?: HttpHeaders) {
    return this.http.get<ChooseSellPointResponse>(`${this.API}/accountAndAdmin`, { headers: header });
  }
}

export class ChooseSellPointResponse {
  sellPoints: { sellPointId: number, sellPointLabel: string }[];
  profile: string;
  fullName: string;
}
