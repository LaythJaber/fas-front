import {Injectable} from '@angular/core';
import {SearchResponse} from '../dto/search-response';
import {Promotion} from '../models/promotion';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PromoModel} from '../models/promo-model';

@Injectable()
export class PromoService {
  PROMO_API = environment.api + '/promotions';

  constructor(private http: HttpClient) {
  }

  create(promo) {
    return this.http.post<Promotion>(`${this.PROMO_API}`, promo);
  }

  update(promo) {
    return this.http.put<Promotion>(`${this.PROMO_API}`, promo);
  }


  filter(promo) {
    return this.http.post<SearchResponse<Promotion>>(`${this.PROMO_API}/filter`, promo);
  }


  annulReactivePromo(id: number) {
    return this.http.get(`${this.PROMO_API}/annul-reactive-promo/${id}`);
  }


  getModels() {
    return this.http.get<PromoModel[]>(`${this.PROMO_API}/get-models`);
  }

  updateModel(request) {
    return this.http.post<number>(this.PROMO_API + '/model', request);
  }

  getPromoModelsLight() {
    return this.http.get<SearchResponse<PromoModel>>(this.PROMO_API + '/model');
  }

  getPromoModelById(id) {
    return this.http.get<PromoModel>(this.PROMO_API + '/model/' + id);
  }

  deleteModelById(id) {
    return this.http.delete<void>(this.PROMO_API + '/model/' + id);
  }
}
