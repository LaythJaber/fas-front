import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeSettingsComponent} from './home-settings.component';
import {RouterModule, Routes} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {SharedModule} from "../../../../shared/shared.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";
import {MatDividerModule} from "@angular/material/divider";
import {CarouselFormComponent} from './components/carousel-form/carousel-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {InformationComponent} from './components/information/information.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import {ColorPickerModule} from "ngx-color-picker";
import {SecondarySlideFormComponent} from './components/secondary-slide-form/secondary-slide-form.component';
import {MatTreeModule} from "@angular/material/tree";
import {MatRadioModule} from "@angular/material/radio";
import {BrandLogoFormComponent} from './components/brand-logo-form/brand-logo-form.component';
import {CKEditorModule} from "@ddobei/ckeditor4-angular";

const routes: Routes = [
  {path: '', component: HomeSettingsComponent},
];

@NgModule({
  declarations: [
    HomeSettingsComponent,
    CarouselFormComponent,
    InformationComponent,
    SecondarySlideFormComponent,
    BrandLogoFormComponent,
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatIconModule,
        TranslateModule,
        MatTabsModule,
        MatDialogModule,
        SharedModule,
        MatCheckboxModule,
        NgbPopoverModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatRippleModule,
        MatTooltipModule,
        AngularEditorModule,
        ColorPickerModule,
        MatTreeModule,
        MatRadioModule,
        CKEditorModule
    ],
  entryComponents: [
    CarouselFormComponent,
    SecondarySlideFormComponent,
    BrandLogoFormComponent
  ]
})
export class HomeSettingsModule {
}
