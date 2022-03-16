import { Pipe, PipeTransform } from '@angular/core';
import {TranslationLoaderService} from "../../core/services/translation-loader.service";

@Pipe({
  name: 'localTranslate',
  pure: false
})
export class LocalTranslate implements PipeTransform {

  siteActiveLanguage: any;

  constructor(
    public  translationLoaderService: TranslationLoaderService
  ) {
    this.translationLoaderService.siteLanguage.subscribe((l) => {
      this.siteActiveLanguage = l;
    });
  }

  transform(object: any, key: string): string {
    if (object && this.siteActiveLanguage) {
      const t = object.transInfo.find(t => {
        return  t.language ? t.language.code.toUpperCase() === this.siteActiveLanguage.toUpperCase()
          : t.langCode.toUpperCase() === this.siteActiveLanguage.toUpperCase();
      });
      if (t) {
        return t[key];
      }
    }
    return '';
  }
}
