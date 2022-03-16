import {LazyRequest} from "../../dto/lazy-request";

export class ShipmentPageRequest extends LazyRequest{
  enabled: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
