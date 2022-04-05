import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';
import {RouterModule, Routes} from "@angular/router";
import { MeetComponent } from './meet/meet.component';
import { MeetConfirmDialogComponent } from './meet-confirm-dialog/meet-confirm-dialog.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {TranslateModule} from "@ngx-translate/core";



const routes: Routes = [
  {
    path: '',
    component: VideoComponent
  },
  {
    path: 'call',
    component: MeetComponent
  }
];


@NgModule({
  declarations: [VideoComponent, MeetComponent, MeetConfirmDialogComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        TranslateModule,

    ],
  entryComponents: [MeetConfirmDialogComponent]
})
export class VideoModule { }
