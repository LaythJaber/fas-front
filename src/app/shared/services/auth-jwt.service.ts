import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {AuthRequest} from '../models/auth-request';
import {AuthResponse} from '../models/auth-response';
import {ChangePasswordRequest} from '../models/change-password-request';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private PUBLIC_API = environment.publicApi;
  private PRIVATE_API = environment.api;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService
  ) {}

  getToken(): string {
    return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken') || '';
  }

  login(credentials: AuthRequest): Observable<void | AuthResponse> {
    return this.http
      .post<AuthResponse>(this.PUBLIC_API + '/auth', credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  loginWithBarcode(barcode: string, rememberMe) {
    return this.http
      .post<AuthResponse>(this.PUBLIC_API + '/auth/barcode', barcode)
      .pipe(map(response => this.authenticateSuccess(response, rememberMe)));
  }

  chooseSellPoint(sellPointId: number, rememberMe: boolean, headers?: HttpHeaders) {
    return this.http.post<AuthResponse>(this.PRIVATE_API + '/auth/sell-point', sellPointId, {headers})
      .pipe(map(response => this.authenticateSuccess(response, rememberMe)));
  }

  private authenticateSuccess(response: AuthResponse, rememberMe: boolean): void | AuthResponse {
    if (response.status === 'DONE') {
      const jwt = response.token;
      if (rememberMe) {
        this.$localStorage.store('authenticationToken', jwt);
      } else {
        this.$sessionStorage.store('authenticationToken', jwt);
      }
    }
    return response;
  }

  changePassword(request: ChangePasswordRequest) {
    return this.http.post<boolean>(this.PUBLIC_API + '/auth/change-password', request)
      .pipe(map(response => response));
  }

  logout(): Observable<void> {
    return new Observable((observer) => {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      this.$sessionStorage.clear('user');
      this.$localStorage.clear('user');
      this.userService.clearAccountCache();
      observer.complete();
    });
  }

  save(student: any) {
    return this.http.post(this.PUBLIC_API + '/register', student);
  }

  loginWithEmailKey(mailKey: string) {
    return this.http
      .get<AuthResponse>(this.PUBLIC_API + '/auth/use-mail-key/' + mailKey)
      .pipe(map(response => this.authenticateSuccess(response, true)));
  }
}
