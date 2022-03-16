import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ConfigurationsService} from '../../../../shared/services/configurations.service';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-linea-form-modal',
  template: `  <h1 mat-dialog-title *ngIf="!data.editMode">
      {{'CONFIGURATION.NEW_LINEA' | translate}}
  </h1>
  <h1 mat-dialog-title *ngIf="data.editMode">
      {{'CONFIGURATION.EDIT_LINEA' | translate}}
  </h1>
  <hr>
  <div mat-dialog-content>
      <form [formGroup]="lineaForm" id="addForm" (ngSubmit)="save()">
          <div class="form-group">
              <label for="description"> {{'CONFIGURATION.LINEA_DESCRIPTION' | translate}}:</label>
              <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                  <input type="text" class="form-control" formControlName="description"
                         [ngClass]="{'is-invalid': submitted && lineaForm.get('description').invalid}"
                         #descInput>
              </div>
              <div *ngIf="submitted && lineaForm.get('description').invalid;" class="d-block invalid-feedback">
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
                  [disabled]="lineaForm.get('description').disabled"
                  form="addForm"
                  (click)="save()">{{'BUTTONS.SAVE' | translate}}
          </button>
      </div>
  </div>`
})
export class LineaFormModalComponent implements OnInit {
  lineaForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  @ViewChild('descInput') descInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<LineaFormModalComponent>,
              private configurationsService: ConfigurationsService,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.lineaForm = new FormGroup({
      id: new FormControl(),
      description: new FormControl(null, [Validators.required])
    });
    if (this.data.editMode) {
      this.lineaForm.patchValue(this.data.linea);
    }
  }


  save() {
    this.submitted = true;
    if (!this.lineaForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.lineaForm.get('description').disable();
    this.addedElement = true;
    if (!this.data.editMode) { // add new preferred contact
      this.configurationsService.addNewLinea(this.lineaForm.getRawValue()).subscribe(d => {
        if (!this.addMultipleCheckbox.value) { // if "add other elements" not checked the dialog is closed
          this.dialogRef.close(d);
        } else { // if "add other elements" not checked the dialog is not closed and the element is added to the backend
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000, panelClass: 'white-snackbar'});
        }
      }, (err) => {
        this.lineaForm.get('description').enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.lineaForm.get('description').enable();
        this.lineaForm.get('description').setValue(null);
        this.submitted = false;
        this.descInput.nativeElement.focus();
      });
    } else {
      this.configurationsService.editLinea(this.lineaForm.getRawValue()).subscribe(d => {
      }, (err) => {
        this.lineaForm.get('description').enable();
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
