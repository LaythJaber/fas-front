import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromoTemplateEditorComponent} from './promo-template-editor.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {PromotionDetailsFormComponent} from './promotion-details-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';

const routes: Routes = [
  {path: '', component: PromoTemplateEditorComponent}
];

@NgModule({
  declarations: [PromoTemplateEditorComponent, PromotionDetailsFormComponent],
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
  ],
  entryComponents: [
    PromotionDetailsFormComponent
  ]
})
export class PromoTemplateEditorModule {
}
