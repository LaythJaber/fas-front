import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  IMAGE_API = environment.publicApi +
    '/images';

  constructor(
    private http: HttpClient
  ) {}

  getImage(id: number, type: string) {
    return this.http.get<string>(this.IMAGE_API + '?id=' + id + '&type=' + type);
  }

  uploadUnlayerImage(request) {
    return this.http.post<{url: string}>(this.IMAGE_API + '/unlayer-upload', request,
      {reportProgress: true, observe: 'events'});
  }
}
