import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditPostComponent} from "./edit-post.component";
import {RouterModule, Routes} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {ReactiveFormsModule} from "@angular/forms";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatDividerModule} from "@angular/material/divider";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ImageCropperModule} from "ngx-image-cropper";

const routes: Routes = [
  {path: '', component: EditPostComponent},
  {path: ':id', component: EditPostComponent},
];

@NgModule({
  declarations: [
    EditPostComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatDividerModule,
    NgbDropdownModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class EditPostModule {
}
