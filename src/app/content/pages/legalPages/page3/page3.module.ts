import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page3Component } from './page3.component';
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
  component: Page3Component
}];
@NgModule({
  declarations: [Page3Component],
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
export class Page3Module { }
