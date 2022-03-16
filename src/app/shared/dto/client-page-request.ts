import {LazyRequest} from "./lazy-request";
import {Gender} from '../enum/gender';

export class ClientPageRequest extends LazyRequest{
  blocked: number = -1;
  confirmed: number = 1;
  cancelled: number = 0;
  createdAt: string = '';
  dateOfBirth: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  gender: Gender;
  senzaOrdine: false;
}
