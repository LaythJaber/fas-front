import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {PaymentType} from "../../../../../../shared/models/payment/payment-type";
import {Payment} from "../../../../../../shared/models/payment/payment";
import {TranslateService} from "@ngx-translate/core";
import {PaymentService} from "../../../../../../shared/services/payment/payment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Language} from "../../../../../../shared/models/language";
import {LanguageService} from "../../../../../../shared/services/language.service";
import {TranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {PaymentTranslation} from "../../../../../../shared/models/payment/payment-translation";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-cash-form',
  templateUrl: './cash-form.component.html',
  styleUrls: ['./cash-form.component.scss']
})
export class CashFormComponent implements OnInit {

  payment: Payment;
  cashForm: FormGroup;

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
    this.initForm();
    this.getPaymentDetails();
  }

  initForm() {
    this.cashForm = new FormGroup({
      id: new FormControl(null),
      code: new FormControl(null),
      description: new FormControl(null),
      descriptionWeb: new FormControl(null),
      percent: new FormControl(null),
      cost: new FormControl(null),
      secondary: new FormControl(false),
      enabled: new FormControl(true),
      additionalInfo: new FormControl(null)
    });
  }

  getPaymentDetails() {
    this.paymentService.getPaymentDetails(PaymentType.CASH).subscribe((response) => {
      this.payment = response;
      this.paymentTranslationList = this.payment.transInfo;
      console.log('paymentTrans  = ', this.paymentTranslationList);
      this.cashForm.patchValue(this.payment);
      this.getLanguageList();
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
            this.cashForm.get('descriptionWeb').setValue(pt.descriptionWeb);
            this.cashForm.get('additionalInfo').setValue(pt.additionalInfo);
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
    this.payment.type = PaymentType.CASH;
    this.payment.description = this.cashForm.get('description').value;
    this.payment.cost = this.cashForm.get('cost').value;
    this.payment.percent = this.cashForm.get('percent').value;
    this.payment.secondary = this.cashForm.get('secondary').value;
    this.payment.enabled = this.cashForm.get('enabled').value;
    this.payment.parameterList = [];

    if (this.activeLanguage) {
      const pt: PaymentTranslation = new PaymentTranslation();
      pt.descriptionWeb = this.cashForm.get('descriptionWeb').value;
      pt.additionalInfo = this.cashForm.get('additionalInfo').value;
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
