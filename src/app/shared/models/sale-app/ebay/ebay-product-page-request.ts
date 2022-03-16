import {LazyRequest} from "../../../dto/lazy-request";

export class EbayProductPageRequest extends LazyRequest {
  availability: string = '';
  expirationDate: string = '';
  status: string = '';
}
