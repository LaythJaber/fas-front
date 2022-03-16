import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {TranslationLoaderService} from 'src/app/core/services/translation-loader.service';
import {ComponenRegistryService} from 'src/app/core/services/component-registry.service';
import {BreadcrumbService} from 'src/app/core/services/breadcrumb.service';
import {AuthService} from '../../../../shared/services/auth-jwt.service';
import { Router} from '@angular/router';
import {UserService} from '../../../../shared/services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {DateAdapter} from '@angular/material';
import {ProfileShowFormDialogComponent} from '../../../../shared/compoenent/profile-show-form-dialog/profile-show-form-dialog.component';
import {Category} from '../../../../shared/models/category';
import {NAVIGATION} from '../../../../core/navigation/navigation-data';
import {AuthGuard} from '../../../../shared/guard/auth-guard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  sideBar: any;
  quickSidebar: any;
   navigation = NAVIGATION;
  breadcrumbs: any[] = [];
  categoryBreadcrumbs: any[] = [];
  subscription: Subscription;
  user: any;
  timeEnd;
  timeStart;
  password;
  dialogRef: any;

  private unsubscribeAll: Subject<any>;

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    public translationLoaderService: TranslationLoaderService,
    private componenRegistryService: ComponenRegistryService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private dateAdapter: DateAdapter<any>,
    private matDialog: MatDialog,
    public authGuard: AuthGuard
  ) {
    this.user = userService.getUser();
    this.unsubscribeAll = new Subject();
    this.subscription = this.breadcrumbService.getBreadcrumb().subscribe(bc => {
      if (bc) {
        this.breadcrumbs = bc;
      } else {
        // clear messages when empty message received
        this.breadcrumbs = [];
      }
    });
    this.breadcrumbService.getCategoryBreadCrumbList().subscribe(cb => {
      if (cb) {
        this.categoryBreadcrumbs = cb;
      }
      else {
        this.categoryBreadcrumbs = [];
      }
    });
  }


  ngOnInit() {
    this.componenRegistryService.onRegistryChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(registry => {
        this.sideBar = this.componenRegistryService.getComponent('sidenav');
        this.quickSidebar = this.componenRegistryService.getComponent('quick-sidebar');
        // console.log(this.authGuard.route_log);
      });
  }

  ngAfterViewInit() {
  }

  toggleSidebar(event): void {
    event.preventDefault();
    this.sideBar.sidebarToggleHandler();
  }

  toggleQuickSidebar(event): void {
    event.preventDefault();
    this.quickSidebar.toggleOpen();
  }

  setLanguage(lang): void {
    this.translationLoaderService.setLanguage(lang);
    this.dateAdapter.setLocale(lang);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  logout() {
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

  openSubCategoryList(category: Category) {
    this.router.navigate(['/category-product-conf'], {
      queryParams: {
        parentId: category.id,
      }
    });
  }
}
