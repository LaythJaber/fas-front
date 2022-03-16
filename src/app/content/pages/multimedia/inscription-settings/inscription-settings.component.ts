import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {LanguageService} from "../../../../shared/services/language.service";
import {MultimediaService} from "../../../../shared/services/multimedia.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Language} from "../../../../shared/models/language";

@Component({
  selector: 'app-inscription-settings',
  templateUrl: './inscription-settings.component.html',
  styleUrls: ['./inscription-settings.component.scss']
})
export class InscriptionSettingsComponent implements OnInit {
  inscriptionSettingsForm: FormGroup;
  langs: Language[];
  constructor(
    private formBuilder: FormBuilder,
    private languageService: LanguageService,
    private multimediaService: MultimediaService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.loadInscriptionMultimedia();
  }

  private loadInscriptionMultimedia() {
    this.buildForm();
    this.multimediaService.getCurrentInscriptionMultimedia().subscribe(res => {
      if (!res) {
        this.languageService.getLanguages().subscribe(langs => {
          this.langs = langs;
          langs.forEach(lang => {
            const transInfo = this.formBuilder.group({
              id: null,
              langCodeId: lang.id,
              langCode: lang.code,
              inscriptionLabel: null,
              inscriptionButton: null,
            });
            this.transInfo.push(transInfo);
          });
        });
      } else {
        while (this.transInfo.length > 0) {
          this.transInfo.removeAt(0);
        }
        this.languageService.getLanguages().subscribe(langs => {
          this.langs = langs;
          langs.forEach(lang => {
            const obj = res.transInfo.find(v => v.langCodeId === lang.id);
            const transInfo = this.formBuilder.group({
              id: obj ? obj.id : null,
              langCodeId: lang.id,
              langCode: lang.code,
              inscriptionLabel: obj ? obj.inscriptionLabel : null,
              inscriptionButton: obj ? obj.inscriptionButton : null,
            });
            this.transInfo.push(transInfo);
          });
        });
      }
    });
  }
  get transInfo() {
    return this.inscriptionSettingsForm.get('transInfo') as FormArray;
  }
  private buildForm() {
    this.inscriptionSettingsForm = this.formBuilder.group({
      transInfo: this.formBuilder.array([]),
    });
  }

  save() {
    this.multimediaService.updateInscriptionMultimedia(this.inscriptionSettingsForm.value)
      .subscribe(() =>
          this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS'), 'Ok', {duration: 1500})
        , error => this.matSnackBar.open(this.translateService.instant('MULTIMEDIA.INTERNAL_SERVER_ERROR'), 'Ok'))
  }
}
