import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {ManufacturerService} from 'src/app/shared/services/manufacturer.service';
import {SweetAlertService} from 'src/app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-manufacturer-form-modal',
  template: `  <h1 mat-dialog-title *ngIf="!data.editMode">
      {{'CONFIGURATION.NEW_MANUFACTURER' | translate}}
  </h1>
  <h1 mat-dialog-title *ngIf="data.editMode">
      {{'CONFIGURATION.EDIT_MANUFACTURERER' | translate}}
  </h1>
  <hr>
  <div mat-dialog-content>
      <form [formGroup]="manufacturerForm" id="addForm" (ngSubmit)="save()">
          <div class="form-group" *ngIf="data.editMode">
              <label for="code"> {{'DATA_TABLE.CODE' | translate}}:</label>
              <div class="input-group-icon input-group-icon-left">
                <span class="input-icon input-icon-left">
                    <i class="ti-info"></i>
                </span>
                  <input type="text" class="form-control" formControlName="code" readonly>
              </div>
          </div>
          <div class="form-group">
              <label for="description"> {{'CONFIGURATION.MANUFACTURER_DESCRIPTION' | translate}}:</label>
              <div class="input-group-icon input-group-icon-left">
                <span class="input-icon input-icon-left">
                    <i class="ti-info"></i>
                </span>
                  <input type="text" class="form-control" formControlName="description"
                         [ngClass]="{'is-invalid': submitted && manufacturerForm.get('description').invalid}"
                         #descInput>
              </div>
              <div *ngIf="submitted && manufacturerForm.get('description').invalid;" class="d-block invalid-feedback">
                  {{'CONFIGURATION.EMPTY_DESCRIPTION' | translate}}
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
                  [disabled]="manufacturerForm.get('description').disabled"
                  form="addForm"
                  (click)="save()">{{'BUTTONS.SAVE' | translate}}
          </button>
      </div>
  </div>`
})
export class ManufacturerFormModalComponent implements OnInit {

  manufacturerForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  @ViewChild('descInput') descInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<ManufacturerFormModalComponent>,
              private manufacturerService: ManufacturerService,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.manufacturerForm = new FormGroup({
      id: new FormControl(),
      code: new FormControl(),
      description: new FormControl(null, [Validators.required, this.noWhitespaceValidator])
    });
    if (this.data.editMode) {
      this.manufacturerForm.patchValue(this.data.manufacturer);
    }
  }
  public noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim() === '';
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  save() {
    this.submitted = true;
    if (!this.manufacturerForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.manufacturerForm.get('description').disable();
    this.addedElement = true;
    if (!this.data.editMode) { // add new preferred contact
      this.manufacturerService.updateManufacturer(this.manufacturerForm.getRawValue()).subscribe(d => {
        if (!this.addMultipleCheckbox.value) { // if "add other elements" not checked the dialog is closed
          this.dialogRef.close(d);
        } else { // if "add other elements" not checked the dialog is not closed and the element is added to the backend
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000, panelClass: 'white-snackbar'});
        }
      }, (err) => {
        this.manufacturerForm.get('description').enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.manufacturerForm.get('description').enable();
        this.manufacturerForm.get('description').setValue(null);
        this.submitted = false;
        this.descInput.nativeElement.focus();
      });
    } else {
      this.manufacturerService.updateManufacturer(this.manufacturerForm.getRawValue()).subscribe(d => {
      }, (err) => {
        this.manufacturerForm.get('description').enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.dialogRef.close(true);
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      });
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeBtnClick() {
    this.dialogRef.close(this.addedElement);
  }

}
