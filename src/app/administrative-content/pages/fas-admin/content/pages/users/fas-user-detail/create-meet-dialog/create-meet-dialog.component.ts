import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-meet-dialog',
  templateUrl: './create-meet-dialog.component.html',
  styleUrls: ['./create-meet-dialog.component.scss']
})
export class CreateMeetDialogComponent {

  eventForm: FormGroup;


  constructor(
    public matDialogRef: MatDialogRef<CreateMeetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  )
  {
    this.eventForm = this._formBuilder.group({
      dateMeet   : ['', [Validators.required]]
    });

    //this.eventForm.get('dateMeet').setValue( Date.now());
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  createEventForm(): any
  {
    //const meeting = this.eventForm.get('dateMeet').value + " " + this.eventForm.get('timeMeet').value;
    //const meeting = this.eventForm.get('dateMeet').value;

    this.matDialogRef.close(this.eventForm.get('dateMeet').value);
  }

  onNoClick(): void {
    this.matDialogRef.close();
  }

}
