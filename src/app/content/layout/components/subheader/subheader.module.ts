import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubheaderComponent } from './subheader.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [SubheaderComponent],
    exports: [SubheaderComponent]
})
export class SubheaderModule { }
