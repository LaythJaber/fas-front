import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth-jwt.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, DateAdapter } from '@angular/material';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  user: any;
  navData: NavigationMenu[];
  homeUrl = '/';
  showGroupName;
  isOwner: boolean;
  constructor(
    public userService: UserService,
    private authService: AuthService,
    private router: Router,
    private matDialog: MatDialog,
    private dateAdapter: DateAdapter<any>) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.isOwner = this.userService.getUser().authorities.some(u => u === 'OWNER');
    if (this.router.url.startsWith('/admin/owner')) {
      this.navData = OWNER_MENU;
    } else if (this.router.url.startsWith('/admin')) {
      this.navData = SUPER_ADMIN_MENU;
      this.showGroupName = true;
    }
    this.userService.fetch().subscribe(u => {
      if (u.profile === 'OWNER') {
        this.homeUrl = '/admin/owner';
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/admin/owner')) {
          this.showGroupName = false;
          this.navData = OWNER_MENU;
        } else if (event.url.startsWith('/admin')) {
          this.showGroupName = true;
          this.navData = SUPER_ADMIN_MENU;
        }
      }
    });
  }

}

const OWNER_MENU: NavigationMenu[] = [
  {
    url: 'types-of-activities',
    translation: 'HEADER.TYPES_OF_ACTIVITIES',
    icon: 'fa fa-boxes'
  },
  {
    url: 'license-config',
    translation: 'HEADER.LICENSE_CONFIG',
    icon: 'fa fa-award'
  },
];
const SUPER_ADMIN_MENU: NavigationMenu[] = [,
  {
    url: 'configurations',
    translation: 'HEADER.CONFIGURATIONS',
    icon: 'ft-settings'
  },
  {
    url: 'roles',
    translation: 'HEADER.MANAGE_ROLES',
    icon: 'ft-folder'
  },
  {
    url: 'operators',
    translation: 'HEADER.MANAGE_OPERATORS',
    icon: 'ft-users'
  }
];



export class NavigationMenu {
  url: string;
  translation: string;
  icon: string;
}
