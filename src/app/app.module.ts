import {ManufacturerModule} from './content/pages/configurations/manufacturer/manufacturer.module';
import {CategoryProductModule} from './content/pages/configurations/category-product/category-product.module';
import {TagModule} from './content/pages/configurations/tag/tag.module';
import {BrandModule} from './content/pages/configurations/brand/brand.module';
import {UmModule} from './content/pages/configurations/um/um.module';
import {CodiceIVAModule} from './content/pages/configurations/codice-iva/codice-iva.module';
import {RepartoModule} from './content/pages/configurations/reparto/reparto.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {OWL_DATE_TIME_FORMATS, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {ThemeConfigService} from './core/services/theme-config.service';
import {SplashScreenService} from './core/services/splash-screen.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {AuthInterceptor} from './shared/interceptor/auth.interceptor';
import {AuthExpiredInterceptor} from './shared/interceptor/auth-expired.interceptor';
import {BackdropComponent} from './core/components/backdrop/backdrop.component';
import {Error401Component} from './content/pages/error-401/error401.component';
import {LineaModule} from './content/pages/configurations/linea/linea.module';
import {GenericTranslationModule} from './content/pages/generic-translation/generic-translation.module';
import {FaqModule} from "./content/pages/legalPages/faq/faq.module";
import {TranslationInterceptor} from "./shared/interceptor/translation.interceptor";
import { ToastrModule } from 'ngx-toastr';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  // suppressScrollX: true
};
// create our cost var with the information about the format that we want
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};
export const MY_NATIVE_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
  timePickerInput: {hour: '2-digit', minute: '2-digit', hourCycle: 'h24'},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};

@NgModule({
  declarations: [
    AppComponent,
    BackdropComponent,
    Error401Component,  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    LoadingBarModule.forRoot(),
    TranslateModule.forRoot(),
    NgxWebstorageModule.forRoot({prefix: 'ecommerce-backoffice', separator: '-'}),
    OwlNativeDateTimeModule,
    LineaModule,
    RepartoModule,
    CodiceIVAModule,
    UmModule,
    BrandModule,
    TagModule,
    GenericTranslationModule,
    CategoryProductModule,
    ManufacturerModule,
    GenericTranslationModule,
    FaqModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: false,
      enableHtml: true,
  })
  ],
  providers: [
    ThemeConfigService,
    SplashScreenService,
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'it-IT'
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    }, {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    },
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: {useUTC: true}
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TranslationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
