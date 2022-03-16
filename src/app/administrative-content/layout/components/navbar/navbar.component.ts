import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslationLoaderService} from '../../../../core/services/translation-loader.service';
import * as Swal from 'sweetalert2';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../../../../shared/services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../../shared/services/auth-jwt.service';
import {DateAdapter} from '@angular/material';
import {ProfileShowFormDialogComponent} from '../../../../shared/compoenent/profile-show-form-dialog/profile-show-form-dialog.component';
import {takeUntil} from 'rxjs/operators';
import {ComponenRegistryService} from '../../../../core/services/component-registry.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any;
  navData: NavigationMenu[];
  homeUrl = '/';
  showGroupName;
  isOwner: boolean;
  sideBar: any;
  private unsubscribeAll: Subject<any>;
  constructor(
    public translationLoaderService: TranslationLoaderService,
    public translate: TranslateService,
    public userService: UserService,
    private authService: AuthService,
    private router: Router,
    private matDialog: MatDialog,
    private dateAdapter: DateAdapter<any>,
    private componenRegistryService: ComponenRegistryService,
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this.componenRegistryService.onRegistryChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(registry => {
        this.sideBar = this.componenRegistryService.getComponent('ownerSidenav');
      });
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

  toggleSidebar(event): void {
    event.preventDefault();
    this.sideBar.sidebarToggleHandler();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  setLanguage(lang): void {
    this.translationLoaderService.setLanguage(lang);
    this.dateAdapter.setLocale(lang);
  }

  alertBeforeGoHome() {
    Swal.default.fire({
      icon: 'question',
      title: this.translate.instant('ALERT_DIALOG.ARE_YOU_SURE'),
      text: this.translate.instant('ALERT_DIALOG.MSG'),
      showCancelButton: true,
      cancelButtonText: this.translate.instant('BUTTONS.CANCEL'),
    }).then(e => {
      if (e.value) {
        this.router.navigate([this.homeUrl], {replaceUrl: true});
      }
    });
  }

  logout() {
    console.log("bye")
    this.authService.logout().subscribe(e => {
    });
    this.router.navigate(['/login']);
  }

  onProfileClick() {
    this.matDialog.open(ProfileShowFormDialogComponent, {
      width: '500px',
      disableClose: true,
      data: this.user
    });
  }
}
const OWNER_MENU: NavigationMenu[] = [
/*  {
    url: 'owner/types-of-activities',
    translation: 'HEADER.TYPES_OF_ACTIVITIES',
    icon: 'ft-activity'
  },
  {
    url: 'owner/license-config',
    translation: 'HEADER.LICENSE_CONFIG',
    icon: 'fas fa-key'
  },*/
];
const SUPER_ADMIN_MENU: NavigationMenu[] = [
/*  {
    url: 'configurations',
    translation: 'HEADER.CONFIGURATIONS',
    icon: 'ft-settings'
  },*/
  {
    url: 'roles',
    translation: 'HEADER.MANAGE_ROLES',
    icon: 'ft-folder'
  },
  {
    url: 'operators',
    translation: 'HEADER.MANAGE_OPERATORS',
    icon: 'ft-users'
  },
  {
    url: 'configurations',
    translation: 'HEADER.CONFIGURATIONS',
    icon: 'ft-settings'
  }
];


export class NavigationMenu {
  url: string;
  translation: string;
  icon: string;
}
