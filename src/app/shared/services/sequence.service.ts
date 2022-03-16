import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Provider} from '../models/provider';
import {SequenceType} from '../enum/sequence-type.enum';

@Injectable({
  providedIn: 'root'
})
export class SequenceService {

  SEQUENCE_API = environment.api + '/sequence';

  constructor(private http: HttpClient) {
  }

  getCurrentSequence(sequenceType: SequenceType) {
    return this.http.post<number>(`${this.SEQUENCE_API}`, sequenceType);
  }


}
