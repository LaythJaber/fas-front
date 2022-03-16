import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/services/auth-jwt.service';
import {UserService} from '../../../shared/services/user.service';

@Component({
  selector: 'error-404',
  templateUrl: './error401.component.html',
  styleUrls: ['./error401.component.scss']
})
export class Error401Component implements OnInit {
  homeUrl;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    const user = this.userService.getUser();
    if (user.authorities.some(e => e === 'GROUP')) {
      this.homeUrl = '/admin';
    } else if (user.authorities.some(e => e === 'OWNER')) {
      this.homeUrl = '/admin/owner';
    } else {
      this.homeUrl = '';
    }
  }

}
