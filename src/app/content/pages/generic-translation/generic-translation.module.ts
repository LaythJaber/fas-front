import { GenericTranslationComponent } from './generic-translation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  declarations: [GenericTranslationComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  entryComponents: [
    GenericTranslationComponent
  ],
  exports: [GenericTranslationComponent]


})
export class GenericTranslationModule { }
