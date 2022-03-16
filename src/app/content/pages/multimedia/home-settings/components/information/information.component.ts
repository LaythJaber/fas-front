import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {Language} from '../../../../../../shared/models/language';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {LanguageService} from '../../../../../../shared/services/language.service';
import {SiteInfoService} from '../../../../../../shared/services/siteinfo/site-info.service';
import {SiteInfo} from '../../../../../../shared/models/siteinfo/site-info';
import {MatTabGroup} from '@angular/material/tabs';


@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, AfterViewChecked {
  @ViewChild('matTabGroup') matTabGroup: MatTabGroup;

  bgColor: string;
  siteInfoForm: FormGroup;
  config = {
    language: 'it'
  };
  selectedTab = 0;

  languageList: Language[] = [];
  siteInfo: SiteInfo;

  constructor(
    private activatedRoute: ActivatedRoute,
    private siteInfoService: SiteInfoService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private router: Router,
    private matDialog: MatDialog,
    private languageService: LanguageService,
    private snackBar: MatSnackBar,
  ) {
    this.getLanguageList();
  }

  ngOnInit() {
    this.getSiteInfoDetails();
  }

  getSiteInfoDetails() {
    this.siteInfoService.getSiteInfoDetails().subscribe((response) => {
      this.siteInfo = response;
      this.bgColor = this.siteInfo.bgColor ? this.siteInfo.bgColor : this.bgColor;
      this.siteInfoForm = this.formBuilder.group({
        id: new FormControl(this.siteInfo.id),
        transInfo: this.formBuilder.array(
          this.languageList.map(l => {
            const obj = this.siteInfo.transInfo.find(t => t.language.id === l.id);
            return new FormGroup({
              id: new FormControl(obj ? obj.id : null),
              language: new FormControl({id: l.id}),
              title: new FormControl(obj ? obj.title : null),
              content: new FormControl(obj ? obj.content : null),
            });
          })
        )
      });
    });
  }


  getLanguageList() {
    this.languageService.getLanguages().subscribe(r => {
      this.languageList = r;
      this.selectedTab = this.languageList.findIndex(u => u.code === this.translateService.currentLang);
      this.buildForm(this.languageList);
      // this.getSiteInfoDetails();
      console.log('langs = ', this.languageList);
    });
  }

  buildForm(langs: Language[]) {
    this.siteInfoForm = this.formBuilder.group({
      id: new FormControl(null),
      transInfo: this.formBuilder.array(
        langs.map(l => {
          return new FormGroup({
            id: new FormControl(null),
            language: new FormControl({id: l.id}),
            title: new FormControl(null),
            content: new FormControl(null),
          });
        })
      )
    });
  }

  get transInfo() {
    return this.siteInfoForm.get('transInfo') as FormArray;
  }

  save() {
    if (this.siteInfoForm.invalid) {
      return;
    }
    const siteInfo = {
      ...this.siteInfoForm.value,
      bgColor: this.bgColor
    };
    this.siteInfoService.updateSiteInfo(siteInfo).subscribe((response) => {
      this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      this.getSiteInfoDetails();
    });
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.matTabGroup._tabHeader._alignInkBarToSelectedTab();
      this.matTabGroup.realignInkBar();
    }, 500);
  }
}
