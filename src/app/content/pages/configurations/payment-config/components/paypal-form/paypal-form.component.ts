import { Component, OnInit } from '@angular/core';
import {Payment} from "../../../../../../shared/models/payment/payment";
import {FormControl, FormGroup} from "@angular/forms";
import {Language} from "../../../../../../shared/models/language";
import {PaymentTranslation} from "../../../../../../shared/models/payment/payment-translation";
import {TranslateService} from "@ngx-translate/core";
import {PaymentService} from "../../../../../../shared/services/payment/payment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LanguageService} from "../../../../../../shared/services/language.service";
import {TranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {MatDialog} from "@angular/material/dialog";
import {PaymentType} from "../../../../../../shared/models/payment/payment-type";
import {PaymentParameter} from "../../../../../../shared/models/payment/payment-parameter";

@Component({
  selector: 'app-paypal-form',
  templateUrl: './paypal-form.component.html',
  styleUrls: ['./paypal-form.component.scss']
})
export class PaypalFormComponent implements OnInit {

  payment: Payment;
  paypalForm: FormGroup;

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
    this.paypalForm = new FormGroup({
      id: new FormControl(null),
      code: new FormControl(null),
      description: new FormControl(null),
      descriptionWeb: new FormControl(null),
      percent: new FormControl(null),
      cost: new FormControl(null),
      secondary: new FormControl(false),
      enabled: new FormControl(true),

      currency: new FormControl(null),
      clientId: new FormControl(null),
      clientSecret: new FormControl(null),

      additionalInfo: new FormControl(null)
    });
  }

  getPaymentDetails() {
    this.paymentService.getPaymentDetails(PaymentType.PAYPAL).subscribe((response) => {
      this.payment = response;
      this.paymentTranslationList = this.payment.transInfo;
      this.getLanguageList();
      this.paypalForm.patchValue(this.payment);
      if (this.payment.parameterList.length > 0) {
        const pc = this.payment.parameterList.find(p => p.code == 'CURRENCY');
        if (pc) {
          this.paypalForm.get('currency').patchValue(pc.value)
        }
        const psk = this.payment.parameterList.find(p => p.code == 'CLIENT_ID');
        if (psk) {
          this.paypalForm.get('clientId').patchValue(psk.value)
        }
        const ppk = this.payment.parameterList.find(p => p.code == 'CLIENT_SECRET');
        if (ppk) {
          this.paypalForm.get('clientSecret').patchValue(ppk.value)
        }
        // const retUrl = this.payment.parameterList.find(p => p.code == 'RETURN_URL');
        // if (retUrl) {
        //   this.paypalForm.get('returnUrl').patchValue(ppk.value)
        // }
        // const cancUrl = this.payment.parameterList.find(p => p.code == 'CANCEL_URL');
        // if (cancUrl) {
        //   this.paypalForm.get('cancelUrl').patchValue(ppk.value)
        // }
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
            this.paypalForm.get('descriptionWeb').setValue(pt.descriptionWeb);
            this.paypalForm.get('additionalInfo').setValue(pt.additionalInfo);
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
    this.payment.type = PaymentType.PAYPAL;
    this.payment.description = this.paypalForm.get('description').value;
    this.payment.cost = this.paypalForm.get('cost').value;
    this.payment.percent = this.paypalForm.get('percent').value;
    this.payment.secondary = this.paypalForm.get('secondary').value;
    this.payment.enabled = this.paypalForm.get('enabled').value;

    const paramList: PaymentParameter[] = [];
    let currencyParameter: PaymentParameter = new PaymentParameter();
    currencyParameter.name = 'CURRENCY';
    currencyParameter.code = 'CURRENCY';
    currencyParameter.value = this.paypalForm.get('currency').value;
    const pc = this.payment.parameterList.find(p => p.code == 'CURRENCY');
    if (pc) {
      currencyParameter.id = pc.id;
      currencyParameter.createdAt = pc.createdAt;
      currencyParameter.updatedAt = pc.updatedAt;
    }
    paramList.push(currencyParameter);

    let clientIdParameter: PaymentParameter = new PaymentParameter();
    clientIdParameter.name = 'CLIENT_ID';
    clientIdParameter.code = 'CLIENT_ID';
    clientIdParameter.value = this.paypalForm.get('clientId').value;
    const psk = this.payment.parameterList.find(p => p.code == 'CLIENT_ID');
    if (psk) {
      clientIdParameter.id = psk.id;
      clientIdParameter.createdAt = psk.createdAt;
      clientIdParameter.updatedAt = psk.updatedAt;
    }
    paramList.push(clientIdParameter);

    let clientSecretParameter: PaymentParameter = new PaymentParameter();
    clientSecretParameter.name = 'CLIENT_SECRET';
    clientSecretParameter.code = 'CLIENT_SECRET';
    clientSecretParameter.value = this.paypalForm.get('clientSecret').value;
    const ppk = this.payment.parameterList.find(p => p.code === 'CLIENT_SECRET');
    if (ppk) {
      clientSecretParameter.id = ppk.id;
      clientSecretParameter.createdAt = ppk.createdAt;
      clientSecretParameter.updatedAt = ppk.updatedAt;
    }
    paramList.push(clientSecretParameter);

    // let returnUrlParameter: PaymentParameter = new PaymentParameter();
    // returnUrlParameter.name = 'RETURN_URL';
    // returnUrlParameter.code = 'RETURN_URL';
    // returnUrlParameter.value = this.paypalForm.get('returnUrl').value;
    // const ppkK = this.payment.parameterList.find(p => p.code === 'RETURN_URL');
    // if (ppkK) {
    //   returnUrlParameter.id = ppkK.id;
    //   returnUrlParameter.createdAt = ppkK.createdAt;
    //   returnUrlParameter.updatedAt = ppkK.updatedAt;
    // }
    // paramList.push(returnUrlParameter);

    // let cancelUrlParameter: PaymentParameter = new PaymentParameter();
    // cancelUrlParameter.name = 'CANCEL_URL';
    // cancelUrlParameter.code = 'CANCEL_URL';
    // cancelUrlParameter.value = this.paypalForm.get('cancelUrl').value;
    // const ppkc = this.payment.parameterList.find(p => p.code === 'CANCEL_URL');
    // if (ppkc) {
    //   cancelUrlParameter.id = ppkc.id;
    //   cancelUrlParameter.createdAt = ppkc.createdAt;
    //   cancelUrlParameter.updatedAt = ppkc.updatedAt;
    // }
    // paramList.push(cancelUrlParameter);

    this.payment.parameterList = paramList;


    if (this.activeLanguage) {
      const pt: PaymentTranslation = new PaymentTranslation();
      pt.descriptionWeb = this.paypalForm.get('descriptionWeb').value;
      pt.additionalInfo = this.paypalForm.get('additionalInfo').value;
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
