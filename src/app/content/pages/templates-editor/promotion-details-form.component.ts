import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PromoModel} from '../../../shared/models/promo-model';
import {SweetAlertService} from '../../../shared/services/sweet-alert.service';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PromoService} from '../../../shared/services/promo.service';

@Component({
  selector: 'app-promotion-details-form-component',
  template: `
      <div mat-dialog-title class="d-flex justify-content-between align-items-center">
          {{'PROMO_EDITOR.TEMPLATE_DETAILS' | translate}}
          <button mat-icon-button color="warn" tabindex="-1" *ngIf="data" (click)="delete()">
              <mat-icon>delete_forever</mat-icon>
          </button>
      </div>
      <div mat-dialog-content>
          <form [formGroup]="modelForm" (ngSubmit)="save()" id="modelForm">
              <div class="form-group">
                  <label for="name">{{'PROMO_EDITOR.NAME' | translate}}*</label>
                  <input type="text" id="name" class="form-control" formControlName="name">
              </div>
              <div class="form-group">
                  <label for="desc">{{'PROMO_EDITOR.DESCRIPTION' | translate}}</label>
                  <textarea id="desc" class="form-control" formControlName="description"></textarea>
              </div>
          </form>
      </div>
      <div mat-dialog-actions class="d-flex justify-content-end">
          <button mat-flat-button color="warn" class="mr-2" [matDialogClose]="">
              <mat-icon>clear</mat-icon>
              {{'BUTTONS.CANCEL' | translate}}</button>
          <button mat-flat-button color="primary" form="modelForm">
              <mat-icon>save</mat-icon>
              {{'BUTTONS.ADD' | translate}}</button>
      </div>
  `
})

export class PromotionDetailsFormComponent implements OnInit {
  modelForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: PromoModel,
    private promoModelService: PromoService,
    private matDialog: MatDialogRef<PromotionDetailsFormComponent>,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private matSnackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.modelForm = this.fb.group({
      id: null,
      name: [null, Validators.required],
      description: null
    });
    if (this.data) {
      this.modelForm.patchValue(this.data);
    }
  }

  save() {
    if (this.modelForm.valid) {
      this.promoModelService.updateModel(this.modelForm.value).subscribe(id => {
        this.matDialog.close(id);
      });
    }
  }

  delete() {
    this.sweetAlertService.warning(this.translate.instant('PROMO_EDITOR.DELETE_MSG'))
      .then(u => {
        if (u.value) {
          this.promoModelService.deleteModelById(this.data.id).subscribe(() => {
            this.matDialog.close('DELETE');
          }, error => {
            this.matSnackBar.open(this.translate.instant('PROMO_EDITOR.TEMPLATE_USED'), 'Ok');
          });
        }
      });
  }
}
