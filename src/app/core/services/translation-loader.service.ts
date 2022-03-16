import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DateAdapter } from '@angular/material';

export interface Locale {
  lang: string;
  data: Object;
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationLoaderService {

  selectedLanguage: LanguageFlag;
  DEFAULT_LANG: string = 'it';

  siteLanguage = new BehaviorSubject(this.DEFAULT_LANG);

  languages: LanguageFlag[] = [
    {
      lang: 'en',
      name: 'English',
      flag: 'assets/img/flags/us.png'
    },
    {
      lang: 'it',
      name: 'Italian',
      flag: 'assets/img/flags/Italy.png'
    },
    {
      lang: 'fr',
      name: 'French',
      flag: 'assets/img/flags/France.png'
    },
  ];

  constructor(
    private dateAdapter: DateAdapter<any>,
    private translate: TranslateService
  ) {
  }

  public loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);
    });
  }

  /*
   * Set initial language
   */
  setInitLang(): void {
    this.setLanguage(this.getActiveLanguage());
    this.siteLanguage.next(this.getActiveLanguage());
  }

  setLanguage(lang) {
    if (lang) {
      this.dateAdapter.setLocale(lang);
      // Set the selected language for the toolbar
      this.languages.forEach((language: LanguageFlag) => {
        if (language.lang === lang) {
          this.selectedLanguage = language;
        }
      });

      this.translate.use(lang);
      this.siteLanguage.next(lang);
      localStorage.setItem('language', lang);
    }
  }

  public getActiveLanguage() {
    return localStorage.getItem('language') || this.translate.currentLang || this.DEFAULT_LANG;
  }

}
