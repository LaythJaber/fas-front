import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {StateStorageService} from '../services/state-storage.service';
import {map} from 'rxjs/operators';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router,
              private userService: UserService,
              ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkLogin(state.url);
  }

  checkLogin(url: string): Observable<boolean> {
    return this.userService.identity().pipe(
      map((account) => {
        if (
          url === '/login' ||
          url === '/sign-up' ||
          url.startsWith('/init-account') ||
          url.startsWith('/forget-password') ||
          url.startsWith('/change-password')) {
          return true;
        }
        if (account) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }));
  }
}

