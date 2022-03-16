import {Component, HostListener, Inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {FaqService} from "../../../../shared/services/faq.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {Qa} from "../../../../shared/models/Qa";

@Component({
  selector: 'app-update-faq',
  template: `
    <div class="modal-header">
      <h4 mat-dialog-title>{{'PAGE_FORM.FAQ' | translate}}</h4>
    </div>
    <div class="modal-body">
      <form [formGroup]="qaForm" id="qaForm">
        <div class="row">

          <div class="form-group col-lg-12 col-md-12">
            <label>{{'PAGE_FORM.MODULES' | translate}} :</label>
            <ng-select [items]="modules"
                       bindValue="id" bindLabel="name"
                       formControlName="moduleId" (change)="getModule($event)"></ng-select>
          </div>

          <div class="form-group col-lg-12 col-md-12">
            <label>{{'PAGE_FORM.LANGUAGE' | translate}} :</label>
            <input type="text"
                   class="form-control form-control-sm" formControlName="langEnum" disabled>
          </div>

          <div class="form-group col-lg-12 col-md-12">
            <label>{{'PAGE_FORM.QUESTION' | translate}} :</label>
            <input type="text"
                   class="form-control form-control-sm" formControlName="question">
          </div>

          <div class="form-group col-lg-12 col-md-12">
            <label>{{'PAGE_FORM.ANSWER' | translate}} :</label>
            <ckeditor class="w-100 col-12" formControlName="answer" [config]="config"></ckeditor>

          </div>
        </div>
        <div class="modal-footer">
          <div mat-dialog-actions>
            <button mat-flat-button color="primary" class="mr-3"
                    (click)="dialogRef.close(false)">{{'BUTTONS.CLOSE' |
              translate}}
            </button>

            <button mat-flat-button color="primary" (click)="save()">{{'BUTTONS.SAVE' | translate}}
            </button>
          </div>
        </div>

      </form>
    </div>`
})


export class UpdateFaqComponent implements OnInit {
  qaForm: FormGroup;
  submitted = false;
  addedElement = false;
  modules: any[]= [];
  unsubscribe$ = new Subject();
  config = {
    language: 'it'
  };
  constructor(public dialogRef: MatDialogRef<UpdateFaqComponent>,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              private faqService: FaqService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.qaForm = new FormGroup({
      id: new FormControl(),
      question: new FormControl(null, [Validators.required]),
      answer: new FormControl(null, [Validators.required]),
      moduleId: new FormControl(null, [Validators.required]),
      langEnum: new FormControl()
    });
    if (this.data.editMode) {
      console.log(this.data.qa);
      this.qaForm.patchValue(this.data.qa);
    }
    this.getAllModules();
  }


  save() {
    this.submitted = true;
    if (!this.qaForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION'))
        .then(e => {
        });
      return;
    }
    this.addedElement = true;
    console.log(this.qaForm.getRawValue());
    this.faqService.updateQa(this.qaForm.getRawValue()).subscribe(r=>{
      this.dialogRef.close(true);
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeBtnClick() {
    this.dialogRef.close(this.addedElement);
  }

  getAllModules(){
    this.faqService.getAllModules().subscribe(res=>{
      this.modules = res;
    });
  }

  getModule(module){
    if (module){
      this.qaForm.get('langEnum').setValue(module.langEnum);
    }else{
      this.qaForm.get('langEnum').setValue(null);
    }
  }

}

