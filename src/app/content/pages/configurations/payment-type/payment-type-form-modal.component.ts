import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfigurationsService} from '../../../../shared/services/configurations.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-payment-type-modal',
  template: `
      <h1 mat-dialog-title *ngIf="!data.editMode">
          {{'CONFIGURATION.NEW_PAYMENT_TYPE' | translate}}
      </h1>
      <h1 mat-dialog-title *ngIf="data.editMode">
          {{'CONFIGURATION.EDIT_PAYMENT' | translate}}
      </h1>
      <hr>
      <div mat-dialog-content>
          <form [formGroup]="professionForm" id="addForm" (ngSubmit)="save()">
              <div class="form-group">
                  <label for="description">{{'CONFIGURATION.NEW_PAYMENT_TYPE_DESCRIPTION' | translate}}:</label>
                  <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                      <input type="text" class="form-control" formControlName="description"
                             [ngClass]="{'is-invalid': submitted && professionForm.get('description').invalid}"
                             #descInput>
                  </div>
                  <div *ngIf="submitted && professionForm.get('description').invalid;" class="d-block invalid-feedback">
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
              <button mat-flat-button color="primary" [disabled]="professionForm.get('description').disabled"
                      form="addForm"
                      (click)="save()">{{'BUTTONS.SAVE' | translate}}
              </button>
          </div>
      </div>
  `
})
export class PaymentTypeFormModalComponent implements OnInit {
  professionForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  @ViewChild('descInput') descInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<PaymentTypeFormModalComponent>,
    private configurationsService: ConfigurationsService,
    private snackBar: MatSnackBar,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.professionForm = new FormGroup({
      id: new FormControl(),
      description: new FormControl(null, [Validators.required])
    });
    if (this.data.editMode) {
      this.professionForm.patchValue(this.data.prefContact);
    }
  }

  save() {
    this.submitted = true;
    if (!this.professionForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.professionForm.get('description').disable();
    this.addedElement = true;
    if (!this.data.editMode) { // add new preferred contact
      this.configurationsService.addNewPaymentType(this.professionForm.getRawValue()).subscribe(d => {
        if (!this.addMultipleCheckbox.value) { // if "add other elements" not checked the dialog is closed
          this.dialogRef.close(d);
          console.log(d);
        } else { // if "add other elements" not checked the dialog is not closed and the element is added to the backend
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000, panelClass: 'white-snackbar'});
        }
      }, (err) => {
        this.professionForm.get('description').enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.professionForm.get('description').enable();
        this.professionForm.get('description').setValue(null);
        this.submitted = false;
        this.descInput.nativeElement.focus();
      });
    } else {
      this.configurationsService.editPaymentType(this.professionForm.getRawValue()).subscribe(d => {
      }, (err) => {
        this.professionForm.get('description').enable();
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
