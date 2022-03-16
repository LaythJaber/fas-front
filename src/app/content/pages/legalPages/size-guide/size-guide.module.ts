import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeGuideComponent } from './size-guide.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {MatButtonModule} from '@angular/material/button';
import {QuillModule} from 'ngx-quill-v2';
import QuillBetterTable from 'quill-better-table';
import Quill from 'quill';
import { CKEditorModule } from '@ddobei/ckeditor4-angular';


const routes: Routes = [{
  path: '',
  component: SizeGuideComponent
}];

Quill.register({
  'modules/better-table': QuillBetterTable
}, true);

@NgModule({
  declarations: [SizeGuideComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    AngularEditorModule,
    MatButtonModule,
    FormsModule,
    CKEditorModule,
    QuillModule.forRoot({
      modules: {
        table: true,
        'better-table': {
          operationMenu: {
            items: {
              unmergeCells: {
                text: 'Another unmerge cells name'
              }
            }
          }
        },
        keyboard: {
          bindings: QuillBetterTable.keyboardBindings
        }
      }
    })
  ]
})
export class SizeGuideModule { }
