import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  NgbAccordionModule,
  NgbPaginationModule,
  NgbTooltipModule,
  NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {UpdateFaqComponent} from "./update-faq.component";
import {SharedModule} from "../../../../shared/shared.module";
import {
  MatButtonModule,
  MatDividerModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule
} from "@angular/material";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {CKEditorModule} from "@ddobei/ckeditor4-angular";

const routes: Routes = [{
  path: '',
  component: FaqComponent
}];
@NgModule({
  declarations: [FaqComponent, UpdateFaqComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        NgbAccordionModule,
        MatIconModule,
        MatButtonModule,
        TranslateModule,
        MatTableModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        SharedModule.forChild(),
        MatDividerModule,
        NgbTypeaheadModule,
        MatProgressSpinnerModule,
        NgbTooltipModule,
        AngularEditorModule,
        CKEditorModule
    ], entryComponents: [
    UpdateFaqComponent
  ], exports:[
    UpdateFaqComponent
  ]
})
export class FaqModule { }
