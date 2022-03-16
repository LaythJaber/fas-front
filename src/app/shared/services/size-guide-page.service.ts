import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SizeGuidePage} from '../models/size-guide-page';

@Injectable({
  providedIn: 'root'
})
export class SizeGuidePageService {

  API = environment.api + '/size-guides';

  constructor (
    private http: HttpClient
  ) {}

  update(request) {
    return this.http.post<SizeGuidePage>(`${this.API}`, request);
  }

  get() {
    return this.http.get<SizeGuidePage>(this.API);
  }

}
