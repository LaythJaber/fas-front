import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {PromoType} from '../../../../shared/enum/promo-type';
import {PromoModel} from '../../../../shared/models/promo-model';
import {Promotion} from '../../../../shared/models/promotion';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ClientMgmService} from '../../../../shared/services/client-mgm.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {PromoService} from '../../../../shared/services/promo.service';
import {FilterClientsComponent} from '../filter-clients/filter-clients.component';
import {debounceTime, take} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as moment from 'moment';
import {TemplateEditorComponent} from '../template-editor/template-editor.component';

@Component({
  selector: 'app-promotion-form',
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.scss']
})
export class PromotionFormComponent implements OnInit {
  promoForm: FormGroup;
  models: PromoModel[] = [];
  editMode;
  editClicked = false;
  promo: Promotion;
  clientRows: any[];
  dialogRef: any;
  receivers;
  receiversId = [];
  template: SafeHtml = '';
  disableSave = false;
  unsubscribe$ = new Subject();
  private design: string;
  private postText: string;
  private postImageUrl: string;
  private templateTxt: string;

  constructor(private translate: TranslateService,
              public snackBar: MatSnackBar,
              private matDialog: MatDialog,
              public formDialogRef: MatDialogRef<PromotionFormComponent>,
              private clientService: ClientMgmService,
              private promoService: PromoService,
              private sanitizer: DomSanitizer,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private sweetAlertService: SweetAlertService) {
  }

  ngOnInit() {
    this.promoService.getModels().subscribe(r => {
      this.models = r;
    });
    const sentDate = new Date();
    sentDate.setHours(sentDate.getHours() + 1);
    this.promoForm = new FormGroup({
      id: new FormControl(),
      seq: new FormControl(),
      type: new FormControl(PromoType.MAIL, Validators.required),
      promoModelId: new FormControl(null, Validators.required),
      object: new FormControl(null, Validators.required),
      message: new FormControl(null, Validators.required),
      sendAt: new FormControl(sentDate, Validators.required),
      clientsId: new FormArray([]),
      shareFacebook: new FormControl(false),
      shareInstagram: new FormControl(false),
    });
    this.promoForm.get('promoModelId').valueChanges.pipe(debounceTime(800)).subscribe(r => {
      if (r && this.models.length) {
        const obj = this.models.find(u => u.id === r);
        this.template = this.sanitizer.bypassSecurityTrustHtml(obj.template);
        this.templateTxt = obj.template;
        this.design = obj.design;
        this.postText = obj.postText;
        this.postImageUrl = obj.postImageUrl;
        return;
      }
      this.template = '';
    });


    if (!this.data.editMode) {
      this.countReceivers();
    }
    if (this.data.editMode) {
      this.promo = this.data.promo;
      console.log(this.promo);
      if (this.promo.template) {
        this.promoForm.patchValue(this.promo, {emitEvent: false});
        this.template = this.sanitizer.bypassSecurityTrustHtml(this.promo.template);
        this.templateTxt = this.promo.template;
        this.design = this.promo.design;
        this.postText = this.promo.postText;
        this.postImageUrl = this.promo.postImageUrl;
      } else {
        this.promoForm.patchValue(this.promo);
      }
      this.receiversId = this.promo.clientsId;
      this.receivers = this.receiversId.length;
      this.promoForm.disable({emitEvent: false});
    }
  }

  countReceivers() {
    this.clientService.countReceivers().subscribe(r => {
      this.receivers = r.length;
      this.receiversId = r;
      this.setReceivers();
    });
  }

  setReceivers() {
    const formArray: FormArray = this.promoForm.get('clientsId') as FormArray;
    this.receiversId.forEach(id => {
      formArray.push(new FormControl(id));
    });
  }

  openReceiversContent(content) {
    if (this.promo) {
      this.clientRows = this.promo.promoClients.reverse();
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      this.dialogRef = this.matDialog.open(content, {
        autoFocus: false,
        maxHeight: '90vh',
        width: '80%'
      });
    } else {
      this.clientService.getClientsByIds(this.promo.clientsId).subscribe(r => {
        if (r) {
          this.clientRows = r;
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.dialogRef = this.matDialog.open(content, {
            autoFocus: false,
            maxHeight: '90vh',
            width: '80%'
          });
        }
      });
    }
  }

  openFilterClients() {
    const dialogRef = this.matDialog.open(FilterClientsComponent,
      {disableClose: true, autoFocus: true, width: '90%', data: this.receiversId});
    dialogRef.afterClosed().subscribe(d => {
      if (d && d.length) {
        this.receivers = d.length;
        this.receiversId = d;
        const formArray: FormArray = this.promoForm.get('clientsId') as FormArray;
        while (formArray.length !== 0) {
          formArray.removeAt(0);
        }
        this.receiversId.forEach(id => {
          formArray.push(new FormControl(id));
        });
      }
    });
  }

  activateEdit() {
    this.editClicked = true;
    this.promoForm.enable();
  }

  save() {
    if (this.promoForm.invalid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (!this.receiversId.length) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.YOU_MUST_SELECT_CLIENTS')).then(e => {
      });
      return;
    }
    this.promoForm.get('sendAt').setValue(moment(this.promoForm.get('sendAt').value).format('YYYY-MM-DDTHH:mm:ss'));
    this.disableSave = true;
    if (!this.data.editMode) {
      this.promoService.create({
        ...this.promoForm.getRawValue(),
        postText: this.postText,
        postImageUrl: this.postImageUrl,
        design: this.design,
        template: this.templateTxt,
      }).subscribe(r => {
        this.disableSave = false;
        this.formDialogRef.close(r.id);
      }, error => this.disableSave = false);
    } else {
      this.promoService.update({
        ...this.promoForm.getRawValue(),
        postText: this.postText,
        postImageUrl: this.postImageUrl,
        design: this.design,
        template: this.templateTxt,
      }).subscribe(r => {
        this.disableSave = false;
        this.formDialogRef.close(r.id);
      }, error => this.disableSave = false);
    }
  }

  close() {
    this.formDialogRef.close();
  }


  openTemplateEditor() {
    this.matDialog.open(TemplateEditorComponent, {
      width: '100vw',
      panelClass: 'templateEditorDialog',
      data: {
        design: this.design
      }
    }).afterClosed().pipe(take((1)))
      .subscribe(res => {
        if (res) {
          this.template = this.sanitizer.bypassSecurityTrustHtml(res.template);
          this.templateTxt = res.template;
          this.design = res.design;
          this.postText = res.postText;
          this.postImageUrl = res.postImageUrl;
        }
      });
  }
}
