import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FasFooterComponent} from "./fas-footer.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [FasFooterComponent],
  exports: [FasFooterComponent]
})
export class FasFooterModule { }
