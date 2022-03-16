import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-owner-navigation',
  templateUrl: './owner-navigation.component.html',
  styleUrls: ['./owner-navigation.component.css']
})
export class OwnerNavigationComponent implements OnInit, OnDestroy {
  isOwner = false;

  constructor(public userService: UserService, private router: Router, private translateService: TranslateService) {
  }

  navigation: any[] = [];
  mySubscription: any;
  groupName = '';

  ngOnInit() {
    console.log('/*/**/*/*');
    console.log(this.router.url);
    const url = this.router.url;
    this.isOwner = this.userService.getUser().authorities.some(u => u === 'OWNER');
    if (this.isOwner) {
      if (url.startsWith('/admin') && !url.startsWith('/admin/owner')) {
        this.groupName = this.userService.getUser().groupName;
        console.log(this.groupName);
        const GRP_MGM_MENU = {
          title: 'Group table' + this.groupName,
          icon: 'ft-list',
          url: '',
          translate: this.translateService.instant('SIDENAV.MANAGE_GRP') + this.groupName,
          children: [
            {
              url: '/admin',
              translation: 'HEADER.MANAGE_ENTERPRISE',
              title: 'HEADER.MANAGE_ENTERPRISE',
              icon: 'ft-list', exact: true
            },
            {
              url: '/admin/roles',
              translation: 'HEADER.MANAGE_ROLES',
              title: 'HEADER.MANAGE_ROLES',
              icon: 'ft-folder', exact: true
            },
            {
              url: '/admin/operators',
              title: 'HEADER.MANAGE_OPERATORS',
              translation: 'HEADER.MANAGE_OPERATORS',
              icon: 'ft-users', exact: true
            },
            {
              url: '/admin/configurations',
              title: 'HEADER.CONFIGURATIONS',
              translation: 'HEADER.CONFIGURATIONS',
              icon: 'ft-settings', exact: true
            }
          ],
        };
        this.navigation = [...OWNER_MENU, GRP_MGM_MENU];
      } else {
        this.navigation = OWNER_MENU;
      }
    } else {
      this.navigation = SUPER_ADMIN_MENU;
    }
    this.router.events.subscribe(event => {
      this.groupName = this.userService.getUser() ? this.userService.getUser().groupName : '';
      const GRP_MGM_MENU = {
        title: 'Group table',
        icon: 'ft-list',
        url: '',
        translate: this.translateService.instant('SIDENAV.MANAGE_GRP') + this.groupName,
        children: [
          {
            url: '/admin',
            translation: 'HEADER.MANAGE_ENTERPRISE',
            title: 'HEADER.MANAGE_ENTERPRISE',
            icon: 'ft-list', exact: true
          },
          {
            url: '/admin/roles',
            translation: 'HEADER.MANAGE_ROLES',
            title: 'HEADER.MANAGE_ROLES',
            icon: 'ft-folder', exact: true
          },
          {
            url: '/admin/operators',
            title: 'HEADER.MANAGE_OPERATORS',
            translation: 'HEADER.MANAGE_OPERATORS',
            icon: 'ft-users', exact: true
          },
          {
            url: '/admin/configurations',
            title: 'HEADER.CONFIGURATIONS',
            translation: 'HEADER.CONFIGURATIONS',
            icon: 'ft-settings', exact: true
          }
        ],
      };
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/admin/owner')) {
          this.navigation = OWNER_MENU;
        } else if (event.url.startsWith('/admin')) {
          console.log('isOwner ---' + this.isOwner);
          this.navigation = this.isOwner ? [...OWNER_MENU, GRP_MGM_MENU] : SUPER_ADMIN_MENU;
        }
      }
    });
  }


  refresh() {
    window.location.reload();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  expand() {
    let elem = document.documentElement;
    let methodToBeInvoked = elem.requestFullscreen ||
      elem['mozRequestFullscreen']
      ||
      elem['msRequestFullscreen'];
    if (methodToBeInvoked) {
      methodToBeInvoked.call(elem);
    }
  }

  close() {
    if (navigator.userAgent.indexOf('MSIE') > 0) {
      if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
        window.opener = null;
        window.close();
      } else {
        window.open('', '_top');
        window.top.close();
      }
    } else if (navigator.userAgent.indexOf('Firefox') > 0) {
      window.location.href = 'about:blank ';
    } else {
      window.opener = null;
      window.open('', '_self', '');
      window.close();
    }
  }

  checkIsAdminOwnerMenu() {
    console.log('dfdsfgg');
    return true;
  }
}


const OWNER_MENU: any[] = [
  {
    heading: true,
    title: 'MENU'
  },
  {
    title: 'Administrators Management',
    icon: 'ft-user',
    exact: true,
    url: '/admin/owner/',
  },
  /*{
    title: 'Configuration table',
    icon: 'ft-settings',
    url: '/admin/owner/types-of-activities',
    translate: 'SIDENAV.CONFIGURATIONS',
    children: [
      {title: 'SIDENAV.CLIENT_CAT', translate: 'SIDENAV.CLIENT_CAT', url: '/admin/owner/types-of-activities', exact: true},
      {title: 'SIDENAV.CAP_CONFIG', translate: 'SIDENAV.CAP_CONFIG', url: '/admin/owner/cap-config', exact: true},
    ],
  {
    title: 'HEADER.LICENSE_CONFIG',
    url: '/admin/owner/license-config',
    translation: 'HEADER.LICENSE_CONFIG',
    icon: 'fa fa-award'
  }, */
];
const SUPER_ADMIN_MENU: any[] = [
  {
    heading: true,
    title: 'MENU'
  },
  {
    url: '/admin',
    translation: 'HEADER.MANAGE_ENTERPRISE',
    title: 'HEADER.MANAGE_ENTERPRISE',
    icon: 'ft-list'
  },
  {
    url: '/admin/roles',
    translation: 'HEADER.MANAGE_ROLES',
    title: 'HEADER.MANAGE_ROLES',
    icon: 'ft-folder'
  },
  {
    url: '/admin/operators',
    title: 'HEADER.MANAGE_OPERATORS',
    translation: 'HEADER.MANAGE_OPERATORS',
    icon: 'ft-users'
  },
  {
    url: '/admin/configurations',
    title: 'HEADER.CONFIGURATIONS',
    translation: 'HEADER.CONFIGURATIONS',
    icon: 'ft-settings'
  }
];
