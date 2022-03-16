import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Um } from 'src/app/shared/models/um';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { UmService } from 'src/app/shared/services/Um.service';

@Component({
  selector: 'app-um-modal',
  template: `
    <div class="modal-header">
      <h4 mat-dialog-title>{{'UM_FORM.CONFIG_UM' | translate}}</h4>
      <button type="button" mat-button mat-dialog-close>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form [formGroup]="umForm" id="umForm">
        <div class="row">

          <div class="form-group col-lg-6 col-md-6">
            <label>{{'UM_FORM.CODE' | translate}} :</label>
            <input type="text" placeholder="{{'UM_FORM.CODE' | translate}}"
              class="form-control form-control-sm" formControlName="code">
          </div>

          <div class="form-group col-lg-6 col-md-6">
            <label>{{'UM_FORM.DESCRIPTION' | translate}} :</label>
            <input type="text" placeholder="{{'UM_FORM.DESCRIPTION' | translate}}"
              class="form-control form-control-sm" formControlName="description">
          </div>


        </div>
        <div class="modal-footer">
          <div mat-dialog-actions>
            <button mat-flat-button color="primary" class="mr-3"
            (click)="dialogRef.close(null)">{{'BUTTONS.CLOSE' | translate}}
            </button>

            <button mat-flat-button color="primary" (click)="save()"
              >{{'BUTTONS.SAVE' | translate}}
            </button>
          </div>
        </div>

      </form>
    </div>

   `
})
export class UmModalComponent implements OnInit {

  private formBuilder = new FormBuilder();
  umForm: FormGroup;
  searchFormControl = new FormControl();
  loading = false;
  rows: Um[] = [];
  totalRecords: number;
  pageSize = 10;
  page = 1;
  columns = [
    '',
    'UM_FORM.CODE',
    'UM_FORM.DESCRIPTION'
  ];

  constructor(
    private umService: UmService,
    private translate: TranslateService,
    private sweetAlertService: SweetAlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UmModalComponent>
  ) { }

  ngOnInit() {

    this.umForm = this.formBuilder.group({
      id: new FormControl(),
      code: new FormControl(null, Validators.required),
      description: new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
    });
    console.log(this.data);
    if (this.data.editMode) {
      this.umForm.patchValue(this.data.um);
    }
  }

  public noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim() === '';
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  save() {
    if (!this.umForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.umService.update(this.umForm.getRawValue()).subscribe((d) => {
      console.log(d);
      this.sweetAlertService.notification(
        this.umForm.get('id').value != null ?
          this.translate.instant('DIALOG.UPDATE_SUCCESS') : this.translate.instant('DIALOG.ADD_SUCCESS')).then(e => {
          });
      this.dialogRef.close(d);
    }, e => {
      this.sweetAlertService.notification(this.umForm.get('id').value != null ?
        this.translate.instant('DIALOG.CANNOT_UPDATE') : this.translate.instant('DIALOG.CANNOT_UPDATE')).then(e => {
        });
    });
  }
}
