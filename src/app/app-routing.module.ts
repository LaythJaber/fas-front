import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './administrative-content/layout/admin-layout.component';
import { AdminLayoutModule } from './administrative-content/layout/admin-layout.module';
import { AuthGuard } from './shared/guard/auth-guard';
import { LayoutComponent } from './content/layout/layout.component';
import { LayoutModule } from './content/layout/layout.module';
import { Error401Component } from './content/pages/error-401/error401.component';
import { VerifyKeysGuard } from './shared/guard/verify-keys.guard';
import {FasLayoutComponent} from "./administrative-content/pages/fas-admin/content/layout/fas-layout.component";
import {FasLayoutModule} from "./administrative-content/pages/fas-admin/content/layout/fas-layout.module";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        canActivate: [AuthGuard],
        path: 'dashboard',
        data: {
          module: 'DASHBOARD'
        },
        loadChildren: './content/pages/dashboard/dashboard.module#DashboardModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'applications',
        data: {
          module: 'WEB_POSITIONING'
        },
        loadChildren: './content/pages/application/application.module#ApplicationModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'documents',
        data: {
          module: 'TRANSACTION'
        },
        loadChildren: './content/pages/document/document.module#DocumentModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'ds',
        data: {
          module: 'PURCHASE'
        },
        loadChildren: './content/pages/ds/ds.module#DsModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'meet',
        data: {
          module: 'LEGAL'
        },
        loadChildren: './content/pages/video/video.module#VideoModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'calendar',
        data: {
          module: 'LEGAL'
        },
        loadChildren: './content/pages/calendar/calendar.module#MeetSchedulerModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'return-purchases',
        data: {
          module: 'RETURN_PRODUCT'
        },
        loadChildren: './content/pages/return-purchases/return-purchase.module#ReturnPurchaseModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'transactions',
        data: {
          module: 'TRANSACTION'
        },
        loadChildren: './content/pages/transactions/transactions.module#TransactionsModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'product-mgm',
        data: {
          module: 'PRODUCT'
        },
        loadChildren: './content/pages/products-and-services/product-management/product-management.module#ProductManagementModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'product-google-merchant',
        data: {
          module: 'GOOGLE_MERCHANT_PRODUCT'
        },
        loadChildren:
          './content/pages/products-and-services/product-google-merchant/product-google-merchant.module#ProductGoogleMerchantModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'product-ebay',
        data: {
          module: 'EBAY_PRODUCT'
        },
        loadChildren: './content/pages/products-and-services/product-ebay/product-ebay.module#ProductEbayModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'product-amazon',
        data: {
          module: 'AMAZON_PRODUCT'
        },
        loadChildren: './content/pages/products-and-services/product-amazon/product-amazon.module#ProductAmazonModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'cart-mgm',
        data: {
          module: 'CART_MGM'
        },
        loadChildren: './content/pages/carts/carts-management/carts-management.module#CartsManagementModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'vat-code-conf',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/codice-iva/codice-iva.module#CodiceIVAModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'payment-type-conf',
        data: {
          module: 'PAYMENT_TYPE_CONF'
        },
        loadChildren: './content/pages/configurations/payment-type/payment-type.module#PaymentTypeModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'linea-conf',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/linea/linea.module#LineaModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'importation',
        data: {
          module: 'IMPORT_CONF'
        },
        loadChildren: './content/pages/configurations/importation/importation.module#ImportationModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'import-config',
        data: {
          module: 'IMPORT_CONF'
        },
        loadChildren: './content/pages/configurations/import-config/import-config.module#ImportConfigModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'general',
        data: {
          module: 'GENERAL_CONFIGURATION'
        },
        loadChildren: './content/pages/configurations/general/general.module#GeneralModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'reparto',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/reparto/reparto.module#RepartoModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'provider',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/provider/provider.module#ProviderModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'um',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/um/um.module#UmModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'product-weight-config',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/product-weight-config/product-weight-config.module#ProductWeightConfigModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'brand',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/brand/brand.module#BrandModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'product-price-list',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/product-price-list/product-price-list.module#ProductPriceListModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'color',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/color-mgm/color-mgm.module#ColorMgmModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'size',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/size-mgm/size-mgm.module#SizeMgmModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'language',
        data: {
          module: 'LANGUAGE_CONF'
        },
        loadChildren: './content/pages/configurations/language/language.module#LanguageModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'tag',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/tag/tag.module#TagModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'manufacturer',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/manufacturer/manufacturer.module#ManufacturerModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'category-product-conf',
        data: {
          module: 'PRODUCT_LINK'
        },
        loadChildren: './content/pages/configurations/category-product/category-product.module#CategoryProductModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'cap-conf',
        data: {
          module: 'CAP_CONF'
        },
        loadChildren: './content/pages/configurations/cap/cap.module#CapModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'payment-config',
        data: {
          module: 'PAYMENT_CONF'
        },
        loadChildren: './content/pages/configurations/payment-config/payment-config.module#PaymentConfigModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'coupon-config',
        data: {
          module: 'COUPON_CONF'
        },
        loadChildren: './content/pages/configurations/coupon/coupon.module#CouponModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'plugin',
        data: {
          module: 'PLUGIN_CONF'
        },
        loadChildren: './content/pages/configurations/plugin/plugin.module#PluginModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'shipment',
        data: {
          module: 'SHIPMENT_CONF'
        },
        loadChildren: './content/pages/configurations/shipment/shipment.module#ShipmentModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'carts-config',
        data: {
          module: 'CART_MGM_CONF'
        },
        loadChildren: './content/pages/configurations/carts-config/carts-config.module#CartsConfigModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'purchases-config',
        data: {
          module: 'PURCHASE_CONF'
        },
        loadChildren: './content/pages/configurations/purchase/purchase.module#PurchaseModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'app-mobile',
        data: {
          module: 'APP_MOBILE'
        },
        loadChildren: './content/pages/mobile-app/mobile-app.module#MobileAppModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'login-config',
        data: {
          module: 'LOGIN_CONFIGURATION'
        },
        loadChildren: './content/pages/configurations/login-configuration/login-configuration.module#LoginConfigurationModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'page-1',
        data: {
          module: 'PAGE_1'
        },
        loadChildren: './content/pages/legalPages/page1/page1.module#Page1Module'
      },
      {
        canActivate: [AuthGuard],
        path: 'size-guide',
        data: {
          module: 'SIZE_GUIDE'
        },
        loadChildren: './content/pages/legalPages/size-guide/size-guide.module#SizeGuideModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'multimedia/home-settings',
        data: {
          module: 'HOME_SETTING'
        },
        loadChildren: './content/pages/multimedia/home-settings/home-settings.module#HomeSettingsModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'multimedia/login-settings',
        data: {
          module: 'INSCRIPTION'
        },
        loadChildren: './content/pages/multimedia/login-settings/login-settings.module#LoginSettingsModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'multimedia/inscription-settings',
        data: {
          module: 'LOGIN'
        },
        loadChildren: './content/pages/multimedia/inscription-settings/inscription-settings.module#InscriptionSettingsModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'multimedia/theme-settings',
        data: {
          module: 'THEME'
        },
        loadChildren: './content/pages/multimedia/theme-settings/theme-settings.module#ThemeSettingsModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'page-2',
        data: {
          module: 'PAGE_2'
        },
        loadChildren: './content/pages/legalPages/page2/page2.module#Page2Module'
      },
      {
        canActivate: [AuthGuard],
        path: 'page-3',
        data: {
          module: 'PAGE_3'
        },
        loadChildren: './content/pages/legalPages/page3/page3.module#Page3Module'
      },
      {
        canActivate: [AuthGuard],
        path: 'cookies',
        data: {
          module: 'COOKIES'
        },
        loadChildren: './content/pages/legalPages/cookies/cookies.module#CookiesModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'faq',
        data: {
          module: 'FAQ'
        },
        loadChildren: './content/pages/legalPages/faq/faq.module#FaqModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'posts',
        data: {
          module: 'BLOG'
        },
        loadChildren: './content/pages/blog/blog.module#BlogModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'purchases',
        data: {
          module: 'PURCHASE'
        },
        loadChildren: './content/pages/purchases/purchase.module#PurchaseModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'positioning',
        data: {
          module: 'WEB_POSITIONING'
        },
        loadChildren: './content/pages/web-positioning/web-positioning.module#WebPositioningModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'promotion',
        data: {
          module: 'PROMOTION'
        },
        loadChildren: './content/pages/promotion/promotion.module#PromotionModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'promotion-template-editor',
        data: {
          module: 'PROMOTION'
        },
        loadChildren: './content/pages/promo-template-editor/promo-template-editor.module#PromoTemplateEditorModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'templates-editor',
        data: {
          module: 'PROMOTION'
        },
        loadChildren: './content/pages/templates-editor/templates-editor.module#TemplatesEditorModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'coupon-mgm',
        data: {
          module: 'COUPON'
        },
        loadChildren: './content/pages/coupons/coupon.module#CouponModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'movement-mgm',
        data: {
          module: 'PRODUCT'
        },
        loadChildren: './content/pages/stock-and-movement/movement-management/movement-management.module#MovementManagementModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'stock-mgm',
        data: {
          module: 'PRODUCT'
        },
        loadChildren: './content/pages/stock-and-movement/stock-management/stock-management.module#StockManagementModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'inventory-mgm',
        data: {
          module: 'PRODUCT'
        },
        loadChildren: './content/pages/stock-and-movement/inventory-management/inventory-management.module#InventoryManagementModule'
      },

    ]
  },
  {
    path: '401',
    canActivate: [AuthGuard],
    component: Error401Component
  },
  {
    path: 'login',
    loadChildren: './authentication/authentication.module#AuthenticationModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'forget-password',
    loadChildren: './forget-password/forget-password.module#ForgetPasswordModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    loadChildren: './change-password/change-password.module#ChangePasswordModule',
    canActivate: [AuthGuard, VerifyKeysGuard]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './administrative-content/pages/admin-module/admin.module#AdminModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'owner',
        loadChildren: './administrative-content/pages/owner/owner.module#OwnerModule',
        canActivate: [AuthGuard],
      },

    ]
  },
  {
    path: 'fas-admin',
    component: FasLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './administrative-content/pages/fas-admin/fas-admin.module#FasAdminModule',
      },]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    AdminLayoutModule,
    LayoutModule,
    FasLayoutModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
