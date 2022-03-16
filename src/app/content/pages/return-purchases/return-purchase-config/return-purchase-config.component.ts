import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {ReturnProductService} from '../../../../shared/services/return-product/return-product.service';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {LanguageService} from '../../../../shared/services/language.service';
import {ReturnProductConfig} from '../../../../shared/models/return-product/return-product-config';
import {ReturnInstructionAttachment} from '../../../../shared/models/return-product/return-instruction-attachment';
import {Language} from '../../../../shared/models/language';

@Component({
  selector: 'app-return-purchase-config',
  templateUrl: './return-purchase-config.component.html',
  styleUrls: ['./return-purchase-config.component.scss']
})
export class ReturnPurchaseConfigComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService,
    private returnProductService: ReturnProductService,
    private formBuilder: FormBuilder,
    private sweetAlertService: SweetAlertService,
    public sanitize: DomSanitizer,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private languageService: LanguageService,
    private http: HttpClient
  ) {}
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
  };

  returnProductConfig: ReturnProductConfig;

  returnProductConfigForm: FormGroup;
  returnConditionForm: FormGroup;
  returnInstructionForm: FormGroup;
  selectedConditionTab = 0;
  selectedInstructionTab = 0;
  selectedInstructionTab2 = 0;
  languageList: Language[] = [];

  filesM: any[] = [];

  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'RETURN_PRODUCT']);
    this.initForms();
    this.getReturnProductConfig(true);
  }

  getUrlSec (url) {
    return this.sanitize.bypassSecurityTrustResourceUrl(url);
  }

  seeFile(attachment) {
    window.open(attachment.attachment, '_blank');
  }

  initForms() {
    this.returnProductConfigForm = new FormGroup({
      id: new FormControl(null),
      enabled: new FormControl(false),
      toleranceTime: new FormControl(null),
      ivaEnabled: new FormControl(false),
      ivaToleranceTime: new FormControl(null),
      attachment: new FormControl(false),
    });
    this.returnConditionForm = new FormGroup({
      id: new FormControl(null),
    });
    this.returnInstructionForm = new FormGroup({
      id: new FormControl(null),
    });
  }

  getReturnProductConfig(tabs: boolean = true) {
    this.returnProductService.getReturnProductConfig().subscribe((response) => {
      this.returnProductConfig = response;
      console.log('return product config = ', this.returnProductConfig);
      this.returnProductConfigForm.patchValue(this.returnProductConfig);
      this.returnConditionForm.patchValue(this.returnProductConfig);
      this.returnInstructionForm.patchValue(this.returnProductConfig);
      this.getLanguageList(tabs);
    });
  }

  updateReturnProductConfig() {
    const returnProduct = {
      ...this.returnProductConfigForm.getRawValue()
    };
    this.returnProductService.updateReturnProductConfig(returnProduct)
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getReturnProductConfig(false);
      });
  }

  updateReturnConditions() {
    const returnConditions = {
      ...this.returnConditionForm.getRawValue()
    };
    this.returnProductService.updateReturnConditions(returnConditions)
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getReturnProductConfig(false);
      });
  }

  updateReturnInstructions() {
    const returnInstructions: ReturnProductConfig = {
      ...this.returnInstructionForm.getRawValue()
    };
    this.returnProductService.updateReturnInstructions(returnInstructions)
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      });
  }


  getLanguageList(tabs: boolean = true) {
    this.languageService.getLanguages().subscribe(r => {
      this.languageList = r;
      if (tabs) {
        this.selectedConditionTab = this.languageList.findIndex(u => u.code === this.translate.currentLang);
        this.selectedInstructionTab = this.selectedConditionTab;
        this.selectedInstructionTab2 = this.selectedInstructionTab;
      }
      const conditionsInfo =  this.formBuilder.array(
        this.languageList.map(l => {
          const obj = this.returnProductConfig ? this.returnProductConfig.conditionsInfo.find(t => t.language.id === l.id) : null;
          return new FormGroup({
            id: new FormControl(obj ? obj.id : null),
            language: new FormControl({id: l.id, code: l.code}),
            title: new FormControl(obj ? obj.title : null),
            conditions: new FormControl(obj ? obj.conditions : null),
          });
        })
      );
      this.returnConditionForm.removeControl('conditionsInfo');
      this.returnConditionForm.addControl('conditionsInfo', conditionsInfo);

      const instructionsInfo =  this.formBuilder.array(
        this.languageList.map(l => {
          const obj = this.returnProductConfig ? this.returnProductConfig.instructionsInfo.find(t => t.language.id === l.id) : null;
          return new FormGroup({
            id: new FormControl(obj ? obj.id : null),
            language: new FormControl({id: l.id, code: l.code}),
            instructions: new FormControl(obj ? obj.instructions : null),
            attachments: new FormControl(obj ? obj.attachments : []),
          });
        })
      );
      this.returnInstructionForm.removeControl('instructionsInfo');
      this.returnInstructionForm.addControl('instructionsInfo', instructionsInfo);
    });
  }
  fileChange($event: Event) {
    this.filesM = [];
    for (let i = 0; i < ($event.target as HTMLInputElement).files.length ; i++) {
      const file = ($event.target as HTMLInputElement).files[i];
      this.filesM.push(file);
    }
  }

  addAttachments() {
    if (this.filesM && this.filesM.length) {
      const lang = this.languageList[this.selectedInstructionTab2].code;
      const formData = new FormData();
      for (const f of this.filesM) {
        formData.append('files', f, f.name);
      }
      this.returnProductService.addAttachments(formData, lang)
        .subscribe((response) => {
          this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
          this.getReturnProductConfig(false);
        });
    }
  }

  deleteAttachment(attachment) {
    this.sweetAlertService
      .warning(this.translate.instant('MULTIMEDIA.ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .then(u => {
        if (u.value) {
          const lang = this.languageList[this.selectedInstructionTab2].code;
          this.returnProductService.deleteAttachment(attachment.id, lang)
            .subscribe((response) => {
              this.snackBar.open(this.translate.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
              this.getReturnProductConfig(false);
            });
        }
      });
  }

  downloadAttachment(attachment: ReturnInstructionAttachment) {
    this.http.get(attachment.attachment, {
      responseType: 'blob'
    }).subscribe(blob => {
      console.log('resp dw = ', blob);
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = attachment.name;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  setTab($event) {
    this.selectedInstructionTab2 = $event;
    this.filesM = [];
  }

}
