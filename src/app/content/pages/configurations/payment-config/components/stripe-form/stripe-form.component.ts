import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {PaymentService} from "../../../../../../shared/services/payment/payment.service";
import {PaymentType} from "../../../../../../shared/models/payment/payment-type";
import {Payment} from "../../../../../../shared/models/payment/payment";
import {PaymentParameter} from "../../../../../../shared/models/payment/payment-parameter";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Language} from "../../../../../../shared/models/language";
import {PaymentTranslation} from "../../../../../../shared/models/payment/payment-translation";
import {LanguageService} from "../../../../../../shared/services/language.service";
import {TranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-stripe-form',
  templateUrl: './stripe-form.component.html',
  styleUrls: ['./stripe-form.component.scss']
})
export class StripeFormComponent implements OnInit {

  payment: Payment;
  stripeForm: FormGroup;

  modalRef: any;
  languageList: Language[] = [];
  activeLanguage: Language;

  paymentTranslationList: PaymentTranslation[] = [];
  paymentDescriptionWebList: string[] = [];
  paymentAdditionalInfoList: string[] = [];

  constructor(
    private translate: TranslateService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private languageService: LanguageService,
    public translationLoaderService: TranslationLoaderService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.createForm();
    this.getPaymentDetails();
  }

  createForm() {
    this.stripeForm = new FormGroup({
      id: new FormControl(null),
      code: new FormControl(null),
      description: new FormControl(null),
      descriptionWeb: new FormControl(null),
      percent: new FormControl(null),
      cost: new FormControl(null),
      secondary: new FormControl(false),
      enabled: new FormControl(true),

      currency: new FormControl(null),
      secretKey: new FormControl(null),
      publicKey: new FormControl(null),

      additionalInfo: new FormControl(null)
    });
  }

  getPaymentDetails() {
    this.paymentService.getPaymentDetails(PaymentType.STRIPE).subscribe((response) => {
      this.payment = response;
      this.paymentTranslationList = this.payment.transInfo;
      this.getLanguageList();
      this.stripeForm.patchValue(this.payment);
      if (this.payment.parameterList.length > 0) {
        const pc = this.payment.parameterList.find(p => p.code == 'CURRENCY');
        if (pc) {
          this.stripeForm.get('currency').patchValue(pc.value)
        }
        const psk = this.payment.parameterList.find(p => p.code == 'SECRET_KEY');
        if (psk) {
          this.stripeForm.get('secretKey').patchValue(psk.value)
        }
        const ppk = this.payment.parameterList.find(p => p.code == 'PUBLIC_KEY');
        if (ppk) {
          this.stripeForm.get('publicKey').patchValue(ppk.value)
        }
      }
    });
  }

  getLanguageList() {
    this.languageService.getLanguages().subscribe(r => {
      this.languageList = r;
      const siteActiveLanguage = this.translationLoaderService.getActiveLanguage();
      const indexActiveLanguage = this.languageList.findIndex(l => l.code.toUpperCase() === siteActiveLanguage.toUpperCase());
      if (indexActiveLanguage != -1) {
        this.activeLanguage = this.languageList[indexActiveLanguage];
        this.languageList = this.languageList.filter( l => l.code.toUpperCase() !== siteActiveLanguage.toUpperCase());
        this.paymentDescriptionWebList = new Array(this.languageList.length);
        this.paymentAdditionalInfoList = new Array(this.languageList.length);
        if (this.payment) {
          const pt: PaymentTranslation = this.payment.transInfo.find(t => t.language.id === this.activeLanguage.id);
          if (pt) {
            this.stripeForm.get('descriptionWeb').setValue(pt.descriptionWeb);
            this.stripeForm.get('additionalInfo').setValue(pt.additionalInfo);
          }
          this.paymentTranslationList = this.paymentTranslationList.filter(t => t.language.id !== this.activeLanguage.id);
          for (let i=0; i<this.paymentTranslationList.length; i++) {
            const t = this.paymentTranslationList[i];
            const index = this.languageList.findIndex(l => l.id === t.language.id);
            if (index !== -1) {
              this.paymentDescriptionWebList[index] = t.descriptionWeb;
              this.paymentAdditionalInfoList[index] = t.additionalInfo;
            }
          }
        }
      }
    });
  }

  openTranslationModal(modal) {
    this.modalRef = this.matDialog.open(modal, {
      width: '800px',
      autoFocus: true,
      disableClose: true,
    });
    this.modalRef.afterClosed().subscribe((d) => {});
  }

  saveDescriptionWebTranslation() {
    for (let i =0; i< this.paymentDescriptionWebList.length; i++) {
      const des = this.paymentDescriptionWebList[i];
      if (des && des.trim()) {
        const pt: PaymentTranslation = new PaymentTranslation();
        pt.descriptionWeb = des.trim();
        pt.language = this.languageList[i];

        const index = this.paymentTranslationList.findIndex(t => t.language.id === this.languageList[i].id);
        if (index === -1) {
          this.paymentTranslationList.push(pt);
        }
        else {
          this.paymentTranslationList[index].descriptionWeb = des.trim();
        }
      }
    }
    this.modalRef.close();
  }

  saveAdditionalInfoTranslation() {
    for (let i =0; i< this.paymentAdditionalInfoList.length; i++) {
      const info = this.paymentAdditionalInfoList[i];
      if (info && info.trim()) {
        const pt: PaymentTranslation = new PaymentTranslation();
        pt.additionalInfo = info.trim();
        pt.language = this.languageList[i];

        const index = this.paymentTranslationList.findIndex(t => t.language.id === this.languageList[i].id);
        if (index === -1) {
          this.paymentTranslationList.push(pt);
        }
        else {
          this.paymentTranslationList[index].additionalInfo = info.trim();
        }
      }
    }
    this.modalRef.close();
  }

  updatePayment() {
    this.payment = this.payment ? this.payment : new Payment();
    this.payment.type = PaymentType.STRIPE;
    this.payment.description = this.stripeForm.get('description').value;
    this.payment.cost = this.stripeForm.get('cost').value;
    this.payment.percent = this.stripeForm.get('percent').value;
    this.payment.secondary = this.stripeForm.get('secondary').value;
    this.payment.enabled = this.stripeForm.get('enabled').value;

    const paramList: PaymentParameter[] = [];
    let currencyParameter: PaymentParameter = new PaymentParameter();
    currencyParameter.name = 'CURRENCY';
    currencyParameter.code = 'CURRENCY';
    currencyParameter.value = this.stripeForm.get('currency').value;
    const pc = this.payment.parameterList.find(p => p.code == 'CURRENCY');
    if (pc) {
      currencyParameter.id = pc.id;
      currencyParameter.createdAt = pc.createdAt;
      currencyParameter.updatedAt = pc.updatedAt;
    }
    paramList.push(currencyParameter);

    let secretKeyParameter: PaymentParameter = new PaymentParameter();
    secretKeyParameter.name = 'SECRET_KEY';
    secretKeyParameter.code = 'SECRET_KEY';
    secretKeyParameter.value = this.stripeForm.get('secretKey').value;
    const psk = this.payment.parameterList.find(p => p.code == 'SECRET_KEY');
    if (psk) {
      secretKeyParameter.id = psk.id;
      secretKeyParameter.createdAt = psk.createdAt;
      secretKeyParameter.updatedAt = psk.updatedAt;
    }
    paramList.push(secretKeyParameter);

    let publicKeyParameter: PaymentParameter = new PaymentParameter();
    publicKeyParameter.name = 'PUBLIC_KEY';
    publicKeyParameter.code = 'PUBLIC_KEY';
    publicKeyParameter.value = this.stripeForm.get('publicKey').value;
    const ppk = this.payment.parameterList.find(p => p.code === 'PUBLIC_KEY');
    if (ppk) {
      publicKeyParameter.id = ppk.id;
      publicKeyParameter.createdAt = ppk.createdAt;
      publicKeyParameter.updatedAt = ppk.updatedAt;
    }
    paramList.push(publicKeyParameter);

    this.payment.parameterList = paramList;


    if (this.activeLanguage) {
      const pt: PaymentTranslation = new PaymentTranslation();
      pt.descriptionWeb = this.stripeForm.get('descriptionWeb').value;
      pt.additionalInfo = this.stripeForm.get('additionalInfo').value;
      pt.language = this.activeLanguage;
      const pat: PaymentTranslation = this.payment.transInfo.find(t => t.language.id === this.activeLanguage.id);
      if (pat) {
        pt.id = pat.id;
      }
      this.paymentTranslationList.push(pt);
    }
    this.payment.transInfo = this.paymentTranslationList;

    this.paymentService.updatePayment(this.payment).subscribe((response) => {
      this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 3000});
      this.getPaymentDetails();
    });
  }

}
