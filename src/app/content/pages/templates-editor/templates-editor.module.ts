import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemplatesEditorComponent} from './templates-editor.component';
import {EmailEditorModule} from 'angular-email-editor';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {PromotionDetailsFormComponent} from './promotion-details-form.component';

const routes: Routes = [
  {path: '', component: TemplatesEditorComponent},
];

@NgModule({
  declarations: [TemplatesEditorComponent, PromotionDetailsFormComponent],
  imports: [
    CommonModule,
    EmailEditorModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
  ], entryComponents: [PromotionDetailsFormComponent]
})
export class TemplatesEditorModule {
}
