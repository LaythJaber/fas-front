import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {StateStorageService} from './state-storage.service';
import {Router} from '@angular/router';
import {Account} from '../models/account.model';
import {Observable, of, ReplaySubject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>();
  private accountCache$?: Observable<Account | null>;
  private PUBLIC_API = environment.publicApi;

  constructor(
    private stateStorageService: StateStorageService,
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private router: Router,
  ) {}

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => {
          return of(null);
        }),
        tap((account: Account | null) => {
          this.authenticate(account);
          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          if (account && account.langKey) {
            const langKey = this.sessionStorage.retrieve('locale') || account.langKey;
            this.changeLanguage(langKey);
          }
          /*if (account) {
            this.navigateToStoredUrl();
          }*/
        })
      );
    }
    return this.accountCache$;
  }

  fetch(): Observable<Account> {
    return this.http.get<any>(this.PUBLIC_API + '/auth/me').pipe(map(e => {
      e.authorities = e.authorities.map(u => u.authority);
      return e;
    }));
  }

  saveUser(user, rememberMe: boolean) {
    if (rememberMe) {
      this.localStorage.store('user', user);
    } else {
      this.sessionStorage.store('user', user);
    }
  }

  getUser(): Account {
    if (this.sessionStorage.retrieve('user')) {
      return this.sessionStorage.retrieve('user');
    }
    return this.localStorage.retrieve('user');
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    localStorage.setItem('fas-user', JSON.stringify(this.userIdentity));
    this.authenticationState.next(this.userIdentity);
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if authentication is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity || !this.userIdentity.authorities) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.userIdentity ? this.userIdentity.imageUrl : '';
  }

  clearAccountCache() {
    this.accountCache$ = null;
  }

  private changeLanguage(langKey: any) {
    // TODO
  }
}
