import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {RegisterService} from '../services/register.service';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import { RecoverPasswordService } from '../services/recover-password.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyKeysGuard implements CanActivate {
  constructor(
    private registerService: RegisterService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private recoverPasswordService: RecoverPasswordService,
    private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url.startsWith('/init-account')) {
      return this.registerService.verifyMailKey(state.url.replace('/init-account/', '')).pipe(map(u => {
        if (!u) {
          this.matSnackBar.open(this.translateService.instant('INIT_ACCOUNT.KEY_EXPIRED'), 'OK');
          this.router.navigate(['']);
        }
        return u;
      }));
    } else {
      console.log(state.url);
      return this.recoverPasswordService.verifyResetPasswordKey(state.url.replace('/change-password/', '')).pipe(map(u => {
        if (!u) {
          this.matSnackBar.open(this.translateService.instant('FORGET_PASSWORD.EXPIRED'), 'OK');
          this.router.navigate(['']);
        }
        return u;
      }));
    }

  }
}
