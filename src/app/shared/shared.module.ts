import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CropImageComponent, ImageErrorSnackBarComponent} from './compoenent/crop-image/crop-image.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatIconModule} from '@angular/material/icon';
import {CustomSnackBarComponent} from './compoenent/custom-snack-bar/custom-snack-bar.component';
import {MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule} from '@angular/material';
import {MatDividerModule} from '@angular/material/divider';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {ClientMgmService} from './services/client-mgm.service';
import {ProviderMgmService} from './services/provider-mgm.service';
import {ConfigurationsService} from './services/configurations.service';
import {SweetAlertService} from './services/sweet-alert.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {ZipCodeService} from './services/zip-code.service';
import {ProductMgmService} from './services/product-mgm.service';
import {EnterpriseService} from './services/enterprise.service';
import {SellPointService} from './services/sell-point.service';
import {RoleService} from './services/role.service';
import {AuthService} from './services/auth-jwt.service';
import {StateStorageService} from './services/state-storage.service';
import {UserService} from './services/user.service';
import {AuthGuard} from './guard/auth-guard';
import {BarCodeMgmService} from './services/bar-code-mgm.service';
import {PaymentService} from './services/payment.service';
import { HasAnyAuthorityDirective } from './has-any-authority.directive';
import {ProfileShowFormDialogComponent} from './compoenent/profile-show-form-dialog/profile-show-form-dialog.component';
import { PriceListService } from './services/price-list.service';
import {CdkDropListScrollContainerDirective} from './util/cdk-drop-list-scroll-container-directive';
import {CurrencyPipe} from './pipes/currency.pipe';
import {FilterPipe} from './pipes/filter.pipe';
import {NumberCommaseparatorlPipe} from "./pipes/number-comma-separator.pipe";
import {LocalTranslate} from "./pipes/local-translate";
import { CartProductModalComponent } from './compoenent/cart-product-modal/cart-product-modal.component';
import {PromoService} from './services/promo.service';
import { AddToCartButtonComponent } from './compoenent/add-to-cart-button/add-to-cart-button.component';
import { ProductFilterModalComponent } from './component/product-filter-modal/product-filter-modal.component';
import { AddProductToPurchaseComponent } from './component/add-product-to-purchase/add-product-to-purchase.component';
import { UploadFileComponent } from './compoenent/upload-file/upload-file.component';
import { ProgressBarComponent } from './compoenent/progress-bar/progress-bar.component';
import {DndDirective} from "./directives/dnd.directive";
import { ShowcaseFilesComponent } from './compoenent/showcase-files/showcase-files.component';

@NgModule({
  declarations: [
    CropImageComponent,
    ImageErrorSnackBarComponent,
    CustomSnackBarComponent,
    HasAnyAuthorityDirective,
    ProfileShowFormDialogComponent,
    CdkDropListScrollContainerDirective,
    CurrencyPipe,
    FilterPipe,
    NumberCommaseparatorlPipe,
    LocalTranslate,
    LocalTranslate,
    CartProductModalComponent,
    AddToCartButtonComponent,
    ProductFilterModalComponent,
    AddProductToPurchaseComponent,
    UploadFileComponent,
    ProgressBarComponent,
    DndDirective,
    ShowcaseFilesComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ImageCropperModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    NgbPaginationModule,
    NgbTooltipModule
  ],
    exports: [
        MatDialogModule,
        ImageCropperModule,
        CropImageComponent,
        CustomSnackBarComponent,
        NgSelectModule,
        HasAnyAuthorityDirective,
        ProfileShowFormDialogComponent,
        CdkDropListScrollContainerDirective,
        CurrencyPipe,
        FilterPipe,
        NumberCommaseparatorlPipe,
        LocalTranslate,
        LocalTranslate,
        NgbPaginationModule,
        AddToCartButtonComponent,
        ProductFilterModalComponent,
        AddProductToPurchaseComponent,
        UploadFileComponent,
        ShowcaseFilesComponent
    ],
  entryComponents: [
    CropImageComponent,
    ImageErrorSnackBarComponent,
    CustomSnackBarComponent,
    ProfileShowFormDialogComponent,
    CartProductModalComponent,
    ProductFilterModalComponent,
    AddProductToPurchaseComponent
  ],
  providers: [
    LocalTranslate
  ]
})
export class SharedModule {
  static forChild(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ClientMgmService,
        ProviderMgmService,
        ProductMgmService,
        PriceListService,
        ConfigurationsService,
        SweetAlertService,
        ZipCodeService,
        EnterpriseService,
        SellPointService,
        SellPointService,
        AuthGuard,
        AuthService,
        StateStorageService,
        UserService,
        SellPointService,
        RoleService,
        BarCodeMgmService,
        PaymentService,
        PromoService
      ]
    };
  }
}
