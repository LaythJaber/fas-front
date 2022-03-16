import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ReturnProductConfig} from "../../models/return-product/return-product-config";

@Injectable({
  providedIn: 'root'
})
export class ReturnProductService {
  RETURN_CONFIG_API = environment.api + '/return-config';

  constructor(
    private http: HttpClient
  ) {
  }

  getReturnProductConfig() {
    return this.http.get<ReturnProductConfig>(`${this.RETURN_CONFIG_API}`);
  }

  updateReturnProductConfig(returnProductConfig: ReturnProductConfig) {
    return this.http.put(`${this.RETURN_CONFIG_API}/`, returnProductConfig, {observe: "response"});
  }

  updateReturnConditions(returnProductConfig: ReturnProductConfig) {
    return this.http.put(`${this.RETURN_CONFIG_API}/conditions`, returnProductConfig, {observe: "response"});
  }

  updateReturnInstructions(returnProductConfig: ReturnProductConfig) {
    return this.http.put(`${this.RETURN_CONFIG_API}/instructions`, returnProductConfig, {observe: "response"});
  }

  addAttachments(request, lang) {
    return this.http.post(`${this.RETURN_CONFIG_API}/instructions/attachments?lang=${lang}`,
      request, {observe: "response"});
  }

  deleteAttachment(id, lang) {
    return this.http.delete(`${this.RETURN_CONFIG_API}/instructions/attachments/${id}?lang=${lang}`,
      {observe: "response"});
  }

}
