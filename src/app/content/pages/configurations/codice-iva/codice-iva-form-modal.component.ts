import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ConfigurationsService} from '../../../../shared/services/configurations.service';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-codice-iva-form-modal',
  template: `
      <h1 mat-dialog-title *ngIf="!data.editMode">
          {{'CONFIGURATION.NEW_IVA_CODE' | translate}}
      </h1>
      <h1 mat-dialog-title *ngIf="data.editMode">
          {{'CONFIGURATION.EDIT_IVA_CODE' | translate}}
      </h1>
      <hr>
      <div mat-dialog-content>
          <form [formGroup]="ivaCodeForm" id="addForm" (ngSubmit)="save()">
              <div class="form-group" *ngIf="data.editMode">
                  <label for="code"> {{'DATA_TABLE.CODE' | translate}}:</label>
                  <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                      <input type="text" class="form-control" formControlName="code" readonly
                             #descInput>
                  </div>
              </div>
              <div class="form-group">
                  <label for="description"> {{'CONFIGURATION.TVA_DESCRIPTION' | translate}}:</label>
                  <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                      <input type="text" class="form-control" formControlName="description"
                             [ngClass]="{'is-invalid': submitted && ivaCodeForm.get('description').invalid}"
                             #descInput>
                  </div>
                  <div *ngIf="submitted && ivaCodeForm.get('description').invalid;" class="d-block invalid-feedback">
                      {{'CONFIGURATION.EMPTY_DESCRIPTION' | translate}}
                  </div>
              </div>

              <div class="form-group">
                  <label for="description">{{'CONFIGURATION.TVA_RATE' | translate}}:</label>
                  <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                      <input type="number" class="form-control" formControlName="value"
                             [ngClass]="{'is-invalid': submitted && ivaCodeForm.get('value').invalid}"
                             #valueInput>
                  </div>
                  <div *ngIf="submitted && ivaCodeForm.get('value').invalid;" class="d-block invalid-feedback">
                      {{'CONFIGURATION.EMPTY_RATE' | translate}}
                  </div>
              </div>

          </form>
      </div>
      <hr>
      <div mat-dialog-actions class="d-flex justify-content-between"
           [ngClass]="{'justify-content-between': !data.editMode, 'justify-content-end': data.editMode}">
          <label class="checkbox checkbox-success" *ngIf="!data.editMode">
              <input [formControl]="addMultipleCheckbox" type="checkbox"><span
                  style="font-size: 10px">{{'CONFIGURATION.ADD_NEW_ELEMENT' | translate}}</span>
          </label>
          <div>
              <button mat-button color="secondary" class="ml-2"
                      (click)="dialogRef.close(addedElement)">{{'BUTTONS.CLOSE' | translate}}</button>
              <button mat-flat-button color="primary"
                      [disabled]="ivaCodeForm.get('description').disabled || ivaCodeForm.get('value').disabled"
                      form="addForm"
                      (click)="save()">{{'BUTTONS.SAVE' | translate}}
              </button>
          </div>
      </div>
  `
})
export class CodiceIvaFormModalComponent implements OnInit {
  ivaCodeForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  @ViewChild('descInput') descInput: ElementRef;
  @ViewChild('valueInput') valueInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<CodiceIvaFormModalComponent>,
              private configurationsService: ConfigurationsService,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.ivaCodeForm = new FormGroup({
      id: new FormControl(),
      code: new FormControl(),
      description: new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
      value: new FormControl(null, [Validators.required])
    });
    if (this.data.editMode) {
      this.ivaCodeForm.patchValue(this.data.ivaCode);
    }
  }

  public noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim() === '';
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  save() {
    this.submitted = true;
    if (!this.ivaCodeForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.ivaCodeForm.get('description').disable();
    this.ivaCodeForm.get('value').disable();
    this.addedElement = true;
    if (!this.data.editMode) { // add new preferred contact
      this.configurationsService.addNewIvaCode(this.ivaCodeForm.getRawValue()).subscribe(d => {
        if (!this.addMultipleCheckbox.value) { // if "add other elements" not checked the dialog is closed
          this.dialogRef.close(d);
        } else { // if "add other elements" not checked the dialog is not closed and the element is added to the backend
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000, panelClass: 'white-snackbar'});
        }
      }, (err) => {
        this.ivaCodeForm.get('description').enable();
        this.ivaCodeForm.get('value').enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.ivaCodeForm.get('description').enable();
        this.ivaCodeForm.get('value').enable();
        this.ivaCodeForm.get('description').setValue(null);
        this.ivaCodeForm.get('value').setValue(null);
        this.submitted = false;
        this.descInput.nativeElement.focus();
      });
    } else {
      this.configurationsService.editIvaCode(this.ivaCodeForm.getRawValue()).subscribe(d => {
        this.dialogRef.close(d);
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      }, (err) => {
        this.ivaCodeForm.get('description').enable();
        this.ivaCodeForm.get('value').enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      });
    }
  }


}
