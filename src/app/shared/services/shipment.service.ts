import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Shipment} from "../models/shipment/shipment";
import {SearchResponse} from "../dto/search-response";
import {ShipmentPageRequest} from "../models/shipment/shipment-page-request";

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  readonly API = environment.api + '/shipments';

  constructor(
    private http: HttpClient
  ) {}


  getAllShipmentList() {
    return this.http.get<Shipment[]>(`${this.API}/list`);
  }

  getLazyShipment(request: ShipmentPageRequest) {
    return this.http.post<SearchResponse<Shipment>>(`${this.API}/filter`, request);
  }

  addShipment(shipment: Shipment) {
    return this.http.post(`${this.API}`, shipment);
  }

  updateShipment(shipment: Shipment) {
    return this.http.put(`${this.API}`, shipment);
  }

  deleteShipment(shipmentId: number) {
    return this.http.delete(`${this.API}/${shipmentId}`, {observe: 'response'});
  }

  changeShipmentStatus(shipmentId: number) {
    return this.http.put(`${this.API}/status/${shipmentId}`, {observe: 'response'});
  }

}
