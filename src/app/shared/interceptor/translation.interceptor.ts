import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {TranslationLoaderService} from "../../core/services/translation-loader.service";

@Injectable({
  providedIn: 'root'
})
export class TranslationInterceptor implements HttpInterceptor{

  constructor(
      public translationLoaderService: TranslationLoaderService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const languageCode = this.translationLoaderService.getActiveLanguage();
    if (req.url.startsWith('/api')) {
      const request = req.clone({
        setHeaders: {
          'Accept-Language': languageCode,
        }
      });
      return next.handle(request);
    }
    return next.handle(req);
  }
}
