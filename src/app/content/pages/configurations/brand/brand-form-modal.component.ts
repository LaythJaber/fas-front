import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import { BrandService } from 'src/app/shared/services/brand.service';

@Component({
  selector: 'app-brand-form-modal',
  template: `  <h1 mat-dialog-title *ngIf="!data.editMode">
      {{'CONFIGURATION.NEW_BRAND' | translate}}
  </h1>
  <h1 mat-dialog-title *ngIf="data.editMode">
      {{'CONFIGURATION.EDIT_BRAND' | translate}}
  </h1>
  <hr>
  <div mat-dialog-content>
      <form [formGroup]="brandForm" id="addForm" (ngSubmit)="save()">
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
              <label for="description"> {{'CONFIGURATION.BRAND_DESCRIPTION' | translate}}:</label>
              <div class="input-group-icon input-group-icon-left">
                    <span class="input-icon input-icon-left">
                        <i class="ti-info"></i>
                    </span>
                  <input type="text" class="form-control" formControlName="description"
                         [ngClass]="{'is-invalid': submitted && brandForm.get('description').invalid}"
                         #descInput>
              </div>
              <div *ngIf="submitted && brandForm.get('description').invalid;" class="d-block invalid-feedback">
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
                  [disabled]="brandForm.get('description').disabled"
                  form="addForm"
                  (click)="save()">{{'BUTTONS.SAVE' | translate}}
          </button>
      </div>
  </div>`
})
export class BrandFormModalComponent implements OnInit {
  brandForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  @ViewChild('descInput') descInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<BrandFormModalComponent>,
              private brandService: BrandService,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.brandForm = new FormGroup({
      id: new FormControl(),
      code: new FormControl(),
      description: new FormControl(null, [Validators.required, this.noWhitespaceValidator])
    });
    if (this.data.editMode) {
      this.brandForm.patchValue(this.data.brand);
    }
  }

  public noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim() === '';
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  save() {
    this.submitted = true;
    if (!this.brandForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.brandForm.get('description').disable();
    this.addedElement = true;
    if (!this.data.editMode) { // add new preferred contact
      this.brandService.updateBrand(this.brandForm.getRawValue()).subscribe(d => {
        if (!this.addMultipleCheckbox.value) { // if "add other elements" not checked the dialog is closed
          this.dialogRef.close(d);
        } else { // if "add other elements" not checked the dialog is not closed and the element is added to the backend
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000, panelClass: 'white-snackbar'});
        }
      }, (err) => {
        this.brandForm.get('description').enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.brandForm.get('description').enable();
        this.brandForm.get('description').setValue(null);
        this.submitted = false;
        this.descInput.nativeElement.focus();
      });
    } else {
      this.brandService.updateBrand(this.brandForm.getRawValue()).subscribe(d => {
      }, (err) => {
        this.brandForm.get('description').enable();
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
