import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {StateStorageService} from '../services/state-storage.service';
import {AuthService} from '../services/auth-jwt.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private stateStorageService: StateStorageService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(null, (err: HttpErrorResponse) => {
      if (err.status === 401 && err.url && !err.url.includes('api/account')) {
        this.stateStorageService.storeUrl(this.router.routerState.snapshot.url);
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }));
  }

}
