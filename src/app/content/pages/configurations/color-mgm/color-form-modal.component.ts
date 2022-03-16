import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {ColorService} from 'src/app/shared/services/color.service';

@Component({
  selector: 'app-color-form-modal',
  template: `  <h1 mat-dialog-title *ngIf="!data.editMode">
      {{'CONFIGURATION.NEW_COLOR' | translate}}
  </h1>
  <h1 mat-dialog-title *ngIf="data.editMode">
      {{'CONFIGURATION.EDIT_COLOR' | translate}}
  </h1>
  <hr>
  <div mat-dialog-content>
      <form [formGroup]="colorForm" id="addForm" (ngSubmit)="save()">
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
              <label for="description"> {{'CONFIGURATION.DESCRIPTION' | translate}}:</label>
              <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                  <input type="text" class="form-control" formControlName="description"
                         [ngClass]="{'is-invalid': submitted && colorForm.get('description').invalid}"
                         #descInput>
              </div>
              <div *ngIf="submitted && colorForm.get('description').invalid;" class="d-block invalid-feedback">
                  {{'CONFIGURATION.EMPTY_DESCRIPTION' | translate}}
              </div>
          </div>

          <div class="form-group">
              <label>{{'DATA_TABLE.COLOR' | translate}}:</label>
              <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                  <input class="form-control" formControlName="codeColor"
                         [(colorPicker)]="codeColor" [style.background]="codeColor" [cpPosition]="'top'"/>
              </div>
          </div>

          <div class="form-group">
              <label for="description"> {{'CONFIGURATION.DESCRIPTION_WEB' | translate}}:</label>
              <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                  <input type="text" class="form-control" formControlName="descriptionWeb"
                         #descInput>
              </div>
          </div>

        <div class="form-group">
          <label for="description" class="mr-2">{{'PRODUCT_FORM.ACTIVE' | translate}}:</label>
          <mat-checkbox color="primary" formControlName="enabled"></mat-checkbox>
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
                  [disabled]="colorForm.get('description').disabled"
                  form="addForm"
                  (click)="save()">{{'BUTTONS.SAVE' | translate}}
          </button>
      </div>
  </div>`
})
export class ColorFormModalComponent implements OnInit {
  colorForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  codeColor = '#eff0ed';

  constructor(public dialogRef: MatDialogRef<ColorFormModalComponent>,
              private colorService: ColorService,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.colorForm = new FormGroup({
      id: new FormControl(),
      code: new FormControl(),
      description: new FormControl(null, [Validators.required]),
      descriptionWeb: new FormControl(),
      codeColor: new FormControl(),
      enabled: new FormControl(false),
    });
    if (this.data.editMode) {
      this.colorForm.patchValue(this.data.color);
      this.codeColor = this.colorForm.value.codeColor;
    }
  }


  save() {
    this.submitted = true;
    this.colorForm.controls.codeColor.setValue(this.codeColor);
    if (!this.colorForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.colorForm.get('description').disable();
    this.addedElement = true;
    if (!this.data.editMode) {
      this.colorService.updateColor(this.colorForm.getRawValue()).subscribe(d => {
        if (!this.addMultipleCheckbox.value) { // if "add other elements" not checked the dialog is closed
          this.dialogRef.close(d);
        } else { // if "add other elements" not checked the dialog is not closed and the element is added to the backend
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000, panelClass: 'white-snackbar'});
        }
      }, (err) => {
        this.colorForm.get('description').enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.colorForm.get('description').enable();
        this.colorForm.get('description').setValue(null);
        this.submitted = false;
      });
    } else {
      this.colorService.updateColor(this.colorForm.getRawValue()).subscribe(d => {
      }, (err) => {
        this.colorForm.get('description').enable();
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
