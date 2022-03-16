import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import { TagService } from 'src/app/shared/services/tag.service';
import {LanguageService} from "../../../../shared/services/language.service";
import {Language} from "../../../../shared/models/language";
import {CropImageComponent} from "../../../../shared/compoenent/crop-image/crop-image.component";
import {take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-tag-form-modal',
  template: `  <h1 mat-dialog-title *ngIf="!data.editMode">
      {{'CONFIGURATION.NEW_TAG' | translate}}
  </h1>
  <h1 mat-dialog-title *ngIf="data.editMode">
      {{'CONFIGURATION.EDIT_TAG' | translate}}
  </h1>
  <hr>
  <div mat-dialog-content>
    <div class="row mb-3">
      <div class="col-12 text-center">
        <div class="img-container">
          <img [alt]="'image.jpg'" [src]="uploadedImageUrl || tagImage || 'assets/img/products/product-default.jpg'"
               style="width: 50px; height: 50px;"
               (click)="openImageCropper()"
          >
        </div>
      </div>
    </div>
    <ng-container [formGroup]="tagForm">
    <div class="row" *ngFor="let internat of internationalizationArray.controls;" >
      <ng-container [formGroup]="internat">
        <div class="form-group col-lg-6 col-md-6">
          <input type="text" class="form-control form-control-sm" formControlName="description" >
        </div>
        <div class="form-group col-lg-6 col-md-6">
          <input type="text" class="form-control form-control-sm" formControlName="langCode" disabled>
        </div>
      </ng-container>
    </div>
    </ng-container>
  </div>
  <hr>
  <div mat-dialog-actions class="d-flex "
       [ngClass]="{'justify-content-end': true}">
      <div>
        <button mat-button color="secondary" class="ml-2"
                (click)="dialogRef.close(addedElement)">{{'BUTTONS.CLOSE' | translate}}</button>
        <button mat-flat-button color="primary"
                form="addForm"
                (click)="save()">{{'BUTTONS.SAVE' | translate}}
        </button>
      </div>
  </div>`
})
export class TagFormModalComponent implements OnInit {
  languages: Language[] = [];
  internationalizationArray: FormArray = new FormArray([]);
  tagForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  editMode;
  editClicked;
  @ViewChild('descInput') descInput: ElementRef;
  tagImage: string = null;
  uploadedImageFile: any = null;
  uploadedImageUrl: string = null;

  constructor(public dialogRef: MatDialogRef<TagFormModalComponent>,
              private tagService: TagService,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              private languageService: LanguageService,
              private matDialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.initialiseArray()
    this.tagForm = new FormGroup({
      id: new FormControl(),
      tagTranslationDtos: this.internationalizationArray
    });
    if (this.data.editMode) {
      this.tagForm.patchValue(this.data.tag);
      this.tagImage = this.data.tag.image;
    }

    this.editMode = this.data.editMode;
    this.editClicked = this.data.editClicked;


    if(!this.data.editMode) {
      for (var control in this.internationalizationArray.controls) {
        this.internationalizationArray.controls[control].disable();
      }
    }
  }
  initialiseArray(){
    this.languageService.getLanguages().subscribe(r => {
      this.languages = r;
      r.forEach(e => {
        var transdes = (this.data.tag==null)? null :this.data.tag.tagTranslationDtos
          .find(a=> a.langCode==e.code)

        const trans = new FormGroup({
          id: new FormControl((transdes===null || transdes ===undefined)? null: transdes.id),
          description: new FormControl((transdes===null || transdes ===undefined)? null: transdes.description),
          langCode: new FormControl(e.code),
          langId: new FormControl(e.id)
        });
        this.internationalizationArray.push(trans);
      });
    });
  }


  save() {
    this.submitted = true;
    if (!this.tagForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
   // this.tagForm.get('description').disable();
    this.addedElement = true;
    if (!this.data.editMode) { // add new preferred contact
      const request: FormData = new FormData();
      let tag = {
        ...this.tagForm.getRawValue()
      };
      request.append('request', new Blob([JSON.stringify(tag)], {type: 'application/json'}));

      if (this.uploadedImageFile) {
        request.append('image', this.uploadedImageFile);
      }

      this.tagService.updateTag(request).subscribe(d => {
          this.dialogRef.close(d);
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000, panelClass: 'white-snackbar'});
      }, (err) => {
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.submitted = false;
      });
    }
    else {
      const request: FormData = new FormData();
      let tag = {
        ...this.tagForm.getRawValue()
      };
      request.append('request', new Blob([JSON.stringify(tag)], {type: 'application/json'}));

      if (this.uploadedImageFile) {
        request.append('image', this.uploadedImageFile);
      }

      this.tagService.updateTag(request).subscribe(d => {
        console.log('request updated = ', d);
      }, (err) => {
        this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
      }, () => {
        this.dialogRef.close(true);
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      });
    }
  }

  readImageFile(file) {
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      this.uploadedImageUrl = fileReader.result.toString();
    };
    fileReader.readAsDataURL(file);
  }

  openImageCropper() {
    this.matDialog.open(CropImageComponent, {
      width: '1200px',
      disableClose: true
    }).afterClosed()
      .pipe(take(1))
      .subscribe(file => {
        if (file) {
          this.uploadedImageFile = file;
          this.readImageFile(file);
        }
      });
  }

  @HostListener('document:keydown.escape')
  onEscapeBtnClick() {
    this.dialogRef.close(this.addedElement);
  }
}
