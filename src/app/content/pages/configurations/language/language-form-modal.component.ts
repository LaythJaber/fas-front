import { LanguageService } from './../../../../shared/services/language.service';
import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {Language} from "../../../../shared/enum/language.enum";

@Component({
  selector: 'app-language-form-modal',
  template: `  <h1 mat-dialog-title *ngIf="!data.editMode">
      {{'CONFIGURATION.NEW_LANGUAGE' | translate}}
  </h1>
  <h1 mat-dialog-title *ngIf="data.editMode">
      {{'CONFIGURATION.EDIT_LANGUAGE' | translate}}
  </h1>
  <hr>
  <div mat-dialog-content>
      <form [formGroup]="languageForm" id="addForm" (ngSubmit)="save()">
        <div class="form-row">

          <div class="form-group col-lg-6 col-md-6">
            <label for="description">{{'CONFIGURATION.LANGUAGE_CODE' | translate}}:</label>
            <div class="input-group-icon input-group-icon-right">
              <ng-select class="ng-select language-ng-select" [items]="languages" [bindLabel]="'description'" [bindValue]="'id'"
                         appendTo="body"
                         (open)="translateLanguages()"
                         formControlName="code" placeholder="{{'CONFIGURATION.LANGUAGE_CODE' | translate}}">
              </ng-select>
            </div>
            <div *ngIf="submitted && languageForm.get('code').invalid" class="d-block invalid-feedback">
              {{'CONFIGURATION.EMPTY_CODE' | translate}}
            </div>
          </div>

          <div class="form-group col-lg-6 col-md-6">
            <label for="description"> {{'CONFIGURATION.LANGUAGE_DESCRIPTION' | translate}}:</label>
            <input type="text" class="form-control form-control-sm" formControlName="description"
                   [ngClass]="{'is-invalid': submitted && languageForm.get('description').invalid}">
            <div *ngIf="submitted && languageForm.get('description').invalid;" class="d-block invalid-feedback">
              {{'CONFIGURATION.EMPTY_DESCRIPTION' | translate}}
            </div>
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
                  [disabled]="languageForm.get('description').disabled"
                  form="addForm"
                  (click)="save()">{{'BUTTONS.SAVE' | translate}}
          </button>
      </div>
  </div>`,
  styles: [
    `::ng-deep.ng-select.language-ng-select.ng-dropdown-panel {
      z-index: 99999;
    }`
  ]
})
export class LanguageFormModalComponent implements OnInit {
  languageForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  languages=[];
  constructor(public dialogRef: MatDialogRef<LanguageFormModalComponent>,
              private languageService: LanguageService,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.translateLanguages();
    this.languageForm = new FormGroup({
      id: new FormControl(),
      code: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
    if (this.data.editMode) {
      console.log(this.data.language);
      this.languageForm.patchValue(this.data.language);
      console.log(this.languageForm.getRawValue());
    }
  }


  save() {
    this.submitted = true;
    if (!this.languageForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.languageForm.disable();
    this.addedElement = true;
    if (!this.data.editMode) { // add new preferred contact
      this.languageService.updateLanguage(this.languageForm.getRawValue()).subscribe(d => {
        if (!this.addMultipleCheckbox.value) { // if "add other elements" not checked the dialog is closed
          this.dialogRef.close(d);
        } else { // if "add other elements" not checked the dialog is not closed and the element is added to the backend
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000, panelClass: 'white-snackbar'});
        }
      }, (err) => {
        this.languageForm.enable();
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.languageForm.enable();
        this.languageForm.get('code').setValue(null);
        this.languageForm.get('description').setValue(null);
        this.submitted = false;
      });
    } else {
      this.languageService.updateLanguage(this.languageForm.getRawValue()).subscribe(d => {
      }, (err) => {
        this.languageForm.enable();
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

  translateLanguages(){
    this.languages = [{ description: Language.en, id: Language.en },
      { description: Language.es, id: Language.es },
      { description: Language.fr, id: Language.fr },
      { description: Language.it, id: Language.it }];
  }
}
