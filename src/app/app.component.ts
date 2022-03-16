import {AfterViewInit, Component, OnInit} from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {SplashScreenService} from './core/services/splash-screen.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslationLoaderService} from './core/services/translation-loader.service';
import {BackdropService} from './core/services/backdrop.service';
import {locale as enLang} from './shared/config/i18n/en';
import {locale as itLang} from './shared/config/i18n/it';
import {locale as frLang} from './shared/config/i18n/fr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loader: LoadingBarService,
    private _splashScreenService: SplashScreenService,
    private _translateService: TranslateService,
    private _translationLoaderService: TranslationLoaderService,
    private _backdropService: BackdropService,
  ) {
    // Set translations
    this._translateService.addLangs(['en', 'it', 'fr']);
    this._translationLoaderService.loadTranslations(enLang, itLang, frLang);
    this._translateService.setDefaultLang('en');
    this._translationLoaderService.setInitLang();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // set page progress bar loading to start on NavigationStart event router
        this.loader.start();
      }
      if (event instanceof RouteConfigLoadStart) {
        this.loader.increment(35);
      }
      if (event instanceof RouteConfigLoadEnd) {
        this.loader.increment(75);
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this._backdropService.hide();
        // set page progress bar loading to end on NavigationEnd event router
        this.loader.complete();
      }
    });
  }

  ngAfterViewInit(): void {
    this._splashScreenService.init();
  }
}
