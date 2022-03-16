import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Company} from '../models/company';
import {BarCodeRequest} from '../models/barCodeRequest';

@Injectable({
  providedIn: 'root'
})
export class BarCodeMgmService {

  BARCODE_API = environment.api + '/bar-code';

  constructor(private http: HttpClient) {
  }

  generateEAN13(request: BarCodeRequest) {
    return this.http.post<string>(`${this.BARCODE_API}`, request);
  }

  validateEAN13(request: BarCodeRequest) {
    return this.http.post<boolean>(`${this.BARCODE_API}/is-valid`, request);
  }

  uniqueProductEAN113(request: BarCodeRequest) {
    return this.http.post<boolean>(`${this.BARCODE_API}/is-unique`, request);
  }

  validateEAN(request: BarCodeRequest) {
    return this.http.post<boolean>(`${this.BARCODE_API}/is-valid-ean`, request);
  }
}
