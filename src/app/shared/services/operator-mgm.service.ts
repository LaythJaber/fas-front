import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SearchResponse} from '../dto/search-response';
import {LazyRequest} from '../dto/lazy-request';
import {Operator} from '../models/operator';
import {SellPoint} from '../models/sell-point';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperatorMgmService {

  OPERATOR_API = environment.api + '/operators';

  constructor(private http: HttpClient) {
  }

  /* Add new operator */
  addNewOperator(operator) {
    return this.http.post(`${this.OPERATOR_API}`, operator, {observe: 'response'});
  }

  /* Edit an existing operator */
  editOperator(operator: Operator) {
    return this.http.put<Operator>(`${this.OPERATOR_API}`, operator, {observe: 'response'});
  }

  /* Get operator list */
  getAllOperators() {
    return this.http.get<{account: Operator, sellPoints: SellPoint[]}[]>(`${this.OPERATOR_API}`).pipe(map(e => {
      return e.map(u => {
        if (u.account.role) {
          u.account.roleId = u.account.role.id;
        }
        return u;
      });
    }));
  }

  /* Delete operator */
  deleteOperator(operatorId) {
    return this.http.delete(`${this.OPERATOR_API}/${operatorId}`, {observe: 'response'});
  }

  /* Change operator active state */
  changeOperatorActiveState(operatorId) {
    return this.http.put(`${this.OPERATOR_API}/active-state/${operatorId}`, {}, {observe: 'response'});
  }

  getLazyOperatorList(request: OperatorLazyRequest) {
    return this.http.post<SearchResponse<Operator>>(`${this.OPERATOR_API}/filter`, request);
  }

  getAllOperatorsBySpId() {
    return this.http.get<Operator[]>(`${this.OPERATOR_API}/get-operator-by-sell-point`);
  }

  getCurrentOperatorsByDate(date) {
    return this.http.post<Operator[]>(`${this.OPERATOR_API}/get-current-operators-by-date`, new Date(date));
  }
  getOperatorsTimeSheet(request: { date: string; ids: number[] }) {
    return this.http.post<TimeSheetResponse[]>(`${this.OPERATOR_API}/operators-time-sheets`, request);
  }


  getActiveAcounts() {
    return this.http.get<Operator[]>(`${this.OPERATOR_API}/search-active`);
  }

  enableDisable(id) {
    return this.http.get(`${this.OPERATOR_API}/enable-disable/${id}`);
  }

  getOperatorDayPlanning(request: { date: string; id: any }) {
    return this.http.post<DayPlanningResponse>(`${this.OPERATOR_API}/get-operator-day-planning`, request);
  }

  changeOperatorDayPlanning(request: any) {
    return this.http.post<void>(`${this.OPERATOR_API}/change-operator-day-planning`, request);
  }

  printEan(request) {
    return this.http.post(`${this.OPERATOR_API}/print-ean`, request, {observe: 'response', responseType: 'blob'});
  }
}

class OperatorLazyRequest extends LazyRequest {}

export interface TimeSheetResponse {
  id: number;
  fromIndex: number;
  toIndex: number;
  pauseDuration: number;
  pauseStartIndex: number;
  withBreak: boolean;
}

export interface DayPlanningResponse {
  yearPlanningId: number;
  weekPlanningId: number;
  day: string;
  start: string;
  end: string;
  withBreak;
  afterBreakStart: string;
  afterBreakEnd: string;
  dayOff: boolean;
}
