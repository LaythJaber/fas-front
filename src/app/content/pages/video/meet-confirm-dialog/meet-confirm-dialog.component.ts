import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-meet-confirm-dialog',
  templateUrl: './meet-confirm-dialog.component.html',
  styleUrls: ['./meet-confirm-dialog.component.scss']
})
export class MeetConfirmDialogComponent {

  pwd:any

  constructor(
    public dialogRef: MatDialogRef<MeetConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.pwd = data.meetPwd;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
