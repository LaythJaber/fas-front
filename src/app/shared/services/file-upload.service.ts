import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  API = environment.api + '/document';

  constructor(private http: HttpClient) { }


  upload(file: File, fileType: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.API}/upload-file/` + fileType, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  getFiles(fileType: string): Observable<any> {
    return this.http.get(`${this.API}/` + fileType);
  }

  getFilesByUser(fileType: string, userId: number): Observable<any> {

    return this.http.get<any>(`${this.API}/load/` + fileType + '/' + userId);
  }

  getFilesByType(fileType: string): Observable<any> {

    return this.http.get<any>(`${this.API}/load/` + fileType);
  }

  downloadByUser(filename: string, fileType: string, userId: number): any {
    return this.http.get(`${this.API}/download/` + filename +'/'+ fileType + '/' + userId, { responseType: 'blob' });
  }

  downloadByType(filename: string, fileType: string): any {
    return this.http.get(`${this.API}/download/` + filename +'/'+ fileType , { responseType: 'blob' });
  }

}
