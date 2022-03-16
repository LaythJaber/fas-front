import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SearchResponse} from '../dto/search-response';
import {LazyRequest} from '../dto/lazy-request';
import {ImportHistory} from '../models/import-history';
import {ImportEnterpriseConfig} from '../models/import-enterprise-config';
import {ImportType} from '../enum/import-type';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ImportEnterpriseModel, ProductToImport} from '../enum/import-enterprise-model';

@Injectable({
  providedIn: 'root'
})
export class ImportationService {
  IMPORT_API = environment.api + '/imports';

  constructor(private http: HttpClient, private translate: TranslateService) {
  }

  runImportProduct() {
    return this.http.get(`${this.IMPORT_API}/run-product-import/`);
  }

  runImportBrands() {
    return this.http.get(`${this.IMPORT_API}/run-brand-import/`);
  }

  runImportColors() {
    return this.http.get(`${this.IMPORT_API}/run-color-import`);
  }

  runImportSizes() {
    return this.http.get(`${this.IMPORT_API}/run-size-import`);
  }

  runImportStore() {
    return this.http.get(`${this.IMPORT_API}/run-store-import`);
  }

  runImportTax() {
    return this.http.get(`${this.IMPORT_API}/run-tax-import/`);
  }

  runImportCat() {
    return this.http.get(`${this.IMPORT_API}/run-category-import/`);
  }

  runImportDept() {
    return this.http.get(`${this.IMPORT_API}/run-department-import/`);
  }


  runImportProducers() {
    return this.http.get(`${this.IMPORT_API}/run-producer-import/`);
  }

  runImportPriceList() {
    return this.http.get(`${this.IMPORT_API}/run-price-list-import`);
  }


  runImportAll() {
    return this.http.get(`${this.IMPORT_API}/run-import-all`);
  }

  filter(request) {
    return this.http.post<SearchResponse<ImportHistory>>(`${this.IMPORT_API}/filter`, request);
  }


  getImportConfig() {
    return this.http.get<ImportEnterpriseConfig>(`${this.IMPORT_API}/import-config`);
  }


  getImportModel() {
    return this.http.get<ImportEnterpriseModel>(`${this.IMPORT_API}/import-model`);
  }

  test(conf) {
    return this.http.post(`${this.IMPORT_API}/test-import-config`, conf);
  }

  saveImportConfig(config) {
    return this.http.post(`${this.IMPORT_API}/import-config`, config);
  }

  savePriceListConfig(config) {
    return this.http.post(`${this.IMPORT_API}/save-price-list-config`, config);
  }

  downloadFile(type: string): Observable<any> {
    return this.http.get(`${this.IMPORT_API}/download/` + type, {responseType: 'blob'}).pipe(map((response) => {
      return {
        filename: this.translate.instant('IMPORT_FORM.' + type) + '.log',
        data: response
      };
    }));
  }


  replicateDb(config) {
    return this.http.post(`${this.IMPORT_API}/replicate-db`, config);
  }

  importProductByCode(productCode: string) {
    return this.http.get(`${this.IMPORT_API}/run-product-import/${productCode}`);
  }
}

class HistoryLazyRequest extends LazyRequest {
  enterpriseId: number;
  date: Date;
  type: ImportType;
}
