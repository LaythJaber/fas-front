import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page2Component } from './page2.component';
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule, MatIconModule} from "@angular/material";
import {NgSelectModule} from "@ng-select/ng-select";
import {CKEditorModule} from "@ddobei/ckeditor4-angular";

const routes: Routes = [{
  path: '',
  component: Page2Component
}];
@NgModule({
  declarations: [Page2Component],
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
export class Page2Module { }
