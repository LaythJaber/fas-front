import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {MultimediaService} from '../../../../shared/services/multimedia.service';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss']
})
export class ThemeSettingsComponent implements OnInit {
  mainColor = '#F24839';
  secondaryColor: any = '#D3D3D3';
  headerColor: any;
  headerColorValue: any = '#D3D3D3';
  subHeaderColor: any;
  subHeaderColorValue: any = '#F9F9F9';
  footerColor: any;
  footerColorValue: any = '#F9F9F9';
  subFooterColor: any;
  subFooterColorValue: any = '#F9F9F9';
  socialIconsColor: any = '#F9F9F9';
  headerIconsColor: any = '#F9F9F9';

  constructor(
    private breadcrumbService: BreadcrumbService,
    private multimediaService: MultimediaService,
    private matSnackbar: MatSnackBar,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['MULTIMEDIA', 'THEME']);
    this.multimediaService.getCurrentEnterpriseThemeColors().subscribe(res => {
      this.mainColor = res.primaryColor;
      this.secondaryColor = res.secondaryColor;
      if (res.socialIconsColor) {
        this.socialIconsColor = res.socialIconsColor;
      }
      if (res.headerIconsColor) {
        this.headerIconsColor = res.headerIconsColor;
      }

      if (res.headerColor === 'DARK' || res.headerColor === 'LIGHT') {
        this.headerColor = res.headerColor;
      } else {
        this.headerColor = 'COLOR';
        this.headerColorValue = res.headerColor;
      }

      if (res.subHeaderColor === 'DARK' || res.subHeaderColor === 'LIGHT') {
        this.subHeaderColor = res.subHeaderColor;
      } else {
        this.subHeaderColor = 'COLOR';
        this.subHeaderColorValue = res.subHeaderColor;
      }

      if (res.footerColor === 'DARK' || res.footerColor === 'LIGHT') {
        this.footerColor = res.footerColor;
      } else {
        this.footerColor = 'COLOR';
        this.footerColorValue = res.footerColor;
      }

      if (res.subFooterColor === 'DARK' || res.subFooterColor === 'LIGHT') {
        this.subFooterColor = res.subFooterColor;
      } else {
        this.subFooterColor = 'COLOR';
        this.subFooterColorValue = res.subFooterColor;
      }
    });
  }

  saveTheme() {
    const request = {
      primaryColor: this.mainColor,
      secondaryColor: this.secondaryColor,
      headerColor: this.headerColor === 'COLOR' ? this.headerColorValue : this.headerColor,
      subHeaderColor: this.subHeaderColor === 'COLOR' ? this.subHeaderColorValue : this.subHeaderColor,
      footerColor: this.footerColor === 'COLOR' ? this.footerColorValue : this.footerColor,
      subFooterColor: this.subFooterColor === 'COLOR' ? this.subFooterColorValue : this.subFooterColor,
      socialIconsColor: this.socialIconsColor,
      headerIconsColor: this.headerIconsColor,
    };
    console.log('request = ', request);
    this.multimediaService.updateThemeColors(request).subscribe(() => {
      this.matSnackbar.open(this.translate.instant('MULTIMEDIA.THEME_UPDATED') + ' ⚡', 'Ok', {duration: 1500});
    });
  }
}
