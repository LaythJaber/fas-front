import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CompanyBusinessService} from '../../../../../shared/services/company-business.service';

@Component({
  selector: 'types-of-activities-form-component',
  template: `
      <div matDialogTitle>
          {{'ADMIN.TYPES_ACTIVITIES.ADD_NEW' | translate}}
      </div>
      <div matDialogContent>
          <form [formGroup]="activityTypeForm" (ngSubmit)="save()" id="activityForm">
              <div class="form-group">
                  <label>Description</label>
                  <input type="text" placeholder="description" class="form-control" formControlName="description">
              </div>
          </form>

      </div>
      <div matDialogActions align="end">
          <button mat-flat-button color="secondary" class="mr-2" [matDialogClose]="">
              <mat-icon>clear</mat-icon>
              {{'BUTTONS.CANCEL' | translate}}</button>
          <button mat-flat-button color="primary" form="activityForm">
              <mat-icon>save</mat-icon>
              {{'BUTTONS.SAVE' | translate}}</button>
      </div>
  `
})

export class TypesOfActivitiesFormComponent implements OnInit {
  activityTypeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private companyBusinessService: CompanyBusinessService,
    private matDialogRef: MatDialogRef<TypesOfActivitiesFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {editMode: boolean, activity}
  ) {
  }

  ngOnInit() {
    this.activityTypeForm = this.fb.group({
      id: null,
      description: [null, Validators.required]
    });
    console.log({data: this.data});
    if (this.data.editMode) {
      console.log(this.data);
      this.activityTypeForm.patchValue(this.data.activity);
    }
  }

  save() {
    this.companyBusinessService.update(this.activityTypeForm.value).subscribe(() => {
      this.matDialogRef.close(true);
    });
  }
}
