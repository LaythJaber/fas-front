import {Component, OnInit} from '@angular/core';
import {StompService} from '@stomp/ng2-stompjs';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {LicenseServiceService} from "../../../../../shared/services/license-service.service";
import {AuthService} from "../../../../../shared/services/auth-jwt.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'layout.content-wrapper',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class FasLayoutComponent  {


  constructor(
    private licenseService: LicenseServiceService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {}


}
