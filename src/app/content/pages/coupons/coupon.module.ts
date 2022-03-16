import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {MatCheckboxModule, MatDatepickerModule, MatIconModule} from '@angular/material';
import {CouponManagementComponent} from './coupon-management/coupon-management.component';
import {MatButtonModule} from '@angular/material';
import { CouponManagementFormComponent } from './coupon-management/coupon-management-form/coupon-management-form.component';
import {MatTreeModule} from '@angular/material/tree';
import { CouponManagementProductComponent } from './coupon-management/coupon-management-product/coupon-management-product.component';
import { CouponManagementClientComponent } from './coupon-management/coupon-management-client/coupon-management-client.component';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import {CustomCurrencyMaskConfig} from '../products-and-services/price-list/price-list.module';
import {FilterCouponClientsComponent} from './coupon-management/filter-coupon-clients/filter-coupon-clients.component';
import {FilterCouponCategoryComponent} from './coupon-management/filter-coupon-category/filter-coupon-category.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import { FilterCouponProductComponent } from './coupon-management/filter-coupon-product/filter-coupon-product.component';

const routes: Routes = [
  { path: '', component: CouponManagementComponent },
  { path: 'new-coupon', component: CouponManagementFormComponent },
  { path: 'update-coupon', component: CouponManagementFormComponent }

];

@NgModule({
  declarations: [ CouponManagementComponent, CouponManagementFormComponent, CouponManagementProductComponent,
    CouponManagementClientComponent,
    FilterCouponClientsComponent, FilterCouponCategoryComponent, FilterCouponProductComponent, FilterCouponProductComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
    ReactiveFormsModule,
    NgbPaginationModule,
    TranslateModule,
    NgbModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
    CurrencyMaskModule,
    InfiniteScrollModule
  ],
  entryComponents: [
    CouponManagementFormComponent,
    FilterCouponClientsComponent,
    FilterCouponCategoryComponent,
    FilterCouponProductComponent
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
} )
export class CouponModule {}
