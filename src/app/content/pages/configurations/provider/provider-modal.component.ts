import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { Provider } from 'src/app/shared/models/provider';
import { ProviderMgmService } from 'src/app/shared/services/provider-mgm.service';

@Component({
  selector: 'app-provider-modal',
  template: `
    <div class="modal-header">

      <h1 mat-dialog-title *ngIf="!data.editMode">
        {{'PROVIDER_FORM.ADD_PROVIDER' | translate}}
      </h1>
      <h1 mat-dialog-title *ngIf="data.editMode">
        {{'PROVIDER_FORM.EDIT_PROVIDER' | translate}}
      </h1>
      <button type="button" mat-button mat-dialog-close>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form [formGroup]="providerForm" id="providerForm">
        <div class="form-group">
          <label for="description"> {{'PROVIDER_FORM.BUSINESS_NAME' | translate}}:</label>
          <div class="input-group-icon input-group-icon-left">
                <span class="input-icon input-icon-left">
                    <em class="ti-info"></em>
                </span>
            <input type="text" class="form-control" formControlName="businessName"
                   [ngClass]="{'is-invalid': submitted && providerForm.get('businessName').invalid}"
                   #descInput>
          </div>
          <div *ngIf="submitted && providerForm.get('businessName').invalid;" class="d-block invalid-feedback">
            {{'CONFIGURATION.EMPTY_DESCRIPTION' | translate}}
          </div>
        </div>

      </form>
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
   `
})
export class ProviderModalComponent implements OnInit {

  private formBuilder = new FormBuilder();
  providerForm: FormGroup;
  searchFormControl = new FormControl();
  loading = false;
  rows: Provider[] = [];
  totalRecords: number;
  submitted = false;
  pageSize = 10;
  page = 1;
  columns = [
    '',
    'PROVIDER_FORM.BUSINESS_NAME'
  ];

  constructor(
    private providerService: ProviderMgmService,
    private translate: TranslateService,
    private sweetAlertService: SweetAlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProviderModalComponent>
  ) { }

  ngOnInit() {

    this.providerForm = this.formBuilder.group({
      id: new FormControl(),
      businessName: new FormControl(null, Validators.required),
    });
    console.log(this.data);
    if (this.data.editMode) {
      this.providerForm.patchValue(this.data.provider);
    }
  }



  save() {
    console.log(this.providerForm);
    if (!this.providerForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (this.providerForm.get('id').value !== null) {
      this.providerService.editProvider(this.providerForm.getRawValue()).subscribe((d) => {
        console.log(d);
        this.sweetAlertService.notification(
         this.translate.instant('DIALOG.UPDATE_SUCCESS') ).then(e => {
        });
        this.dialogRef.close(d);
      }, e => {
        this.sweetAlertService.notification(this.providerForm.get('id').value != null ?
          this.translate.instant('DIALOG.CANNOT_UPDATE') : this.translate.instant('DIALOG.CANNOT_UPDATE')).then(e => {
        });
      });
    }
    if (this.providerForm.get('id').value === null) {
      this.providerService.addNewProvider(this.providerForm.getRawValue()).subscribe((d) => {
        console.log(d);
        this.sweetAlertService.notification(
           this.translate.instant('DIALOG.ADD_SUCCESS')).then(e => {
        });
        this.dialogRef.close(d);
      }, e => {
        this.sweetAlertService.notification(this.providerForm.get('id').value != null ?
          this.translate.instant('DIALOG.CANNOT_UPDATE') : this.translate.instant('DIALOG.CANNOT_UPDATE')).then(e => {
        });
      });
    }
  }
}
