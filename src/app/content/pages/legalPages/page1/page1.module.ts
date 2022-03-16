import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page1Component } from './page1.component';
import {RouterModule, Routes} from "@angular/router";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule, MatIconModule} from "@angular/material";
import {NgSelectModule} from "@ng-select/ng-select";
import {CKEditorModule} from "@ddobei/ckeditor4-angular";

const routes: Routes = [{
  path: '',
  component: Page1Component
}];
@NgModule({
  declarations: [Page1Component],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        HttpClientModule,
        AngularEditorModule,
        ReactiveFormsModule,
        TranslateModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        NgSelectModule,
        CKEditorModule,
    ]
})
export class Page1Module { }
