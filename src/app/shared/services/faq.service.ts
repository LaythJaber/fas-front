import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Module} from "../models/module";
import {Qa} from "../models/Qa";
import {Faq} from "../models/faq";

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  API = environment.api + '/faqs';

  constructor(private http: HttpClient) {
  }

  updateModule(module) {
    return this.http.post<Module>(`${this.API}`, module);
  }

   updateFaq(request?:any) {
    return this.http.post<Faq>(`${this.API}/faq`, request);
  }

  getAllModules() {
    return this.http.get<Module[]>(`${this.API}`);
  }

  deleteModule(id) {
    return this.http.delete(`${this.API}/${id}`, {observe: 'response'});
  }

  deleteQa(id) {
    return this.http.delete(`${this.API}/qa/${id}`, {observe: 'response'});
  }

  updateQa(qa) {
    return this.http.post<Qa>(`${this.API}/qa`, qa);
  }

  getAllQas(moduleId) {
    return this.http.get<Qa[]>(`${this.API}/${moduleId}`);
  }

  getQaBySearch(textSearch) {
    return this.http.get<Qa[]>(`${this.API}/qa/${textSearch}`);
  }

}
