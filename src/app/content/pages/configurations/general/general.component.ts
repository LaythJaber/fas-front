import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {GeneralConfigurationsService} from "../../../../shared/services/general-configurations.service";
import {GeneralConfigurations} from "../../../../shared/models/general-configurations";
import {SellPoint} from '../../../../shared/models/sell-point';
import {SellPointService} from '../../../../shared/services/sell-point.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  pageList: {id: number, label: string}[] = [
    {id: 1, label: 'Pagina 1'},
    {id: 2, label: 'Pagina 2'},
    {id: 3, label: 'Pagina 3'},
  ];

  fontList: {id: string, label: string}[] = [
    {id: 'Architectural', label: 'Architectural'},
    {id: 'Arial', label: 'Arial'},
    {id: 'Garamond Bold', label: 'Garamond Bold'},
    {id: 'Helvetica Neue', label: 'Helvetica Neue'},
    {id: 'Lato', label: 'Lato'},
    {id: 'Montserrat', label: 'Montserrat'},
    {id: 'Optima', label: 'Optima'},
    {id: 'Roboto', label: 'Roboto'},
    {id: 'Palatino', label: 'Palatino'},
    {id: 'Pristina', label: 'Pristina'},
    {id: 'Roffe', label: 'Roffe'},
    {id: 'Times New Roman', label: 'Times New Roman'},
  ];

  generalConfigurationsForm: FormGroup;
  generalConfigurations: GeneralConfigurations;
  sellPointList: SellPoint[] = [];
  id: number;
  constructor(
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private breadcrumbService: BreadcrumbService,
    private generalConfigurationsService: GeneralConfigurationsService,
    private translateService: TranslateService,  private matSnackbar: MatSnackBar, private sellPointService: SellPointService
  ) {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'GENERAL_CONFIGURATION']);
    this.initForms();
  }

  ngOnInit() {
    this.getSellPointList();
     this.getGeneralConfigurationsDetails();
  }

  initForms() {
    this.generalConfigurationsForm = new FormGroup({
      siteName: new FormControl(null, Validators.required),
      productCardType: new FormControl(null, Validators.required),
      primaryFont: new FormControl('Lato'),
      colorDisplayType: new FormControl('DROP_DOWN'),
      newsletterPageIndex: new FormControl(null),
      marketingPageIndex: new FormControl(null),
      privacyPageIndex: new FormControl(null),
    });
  }

  getGeneralConfigurationsDetails() {
    this.generalConfigurationsService.getCurrentEnterpriseGeneralConfigurations()
      .subscribe((response) => {
        console.log('g config = ', response);
        this.generalConfigurations = response;
        this.generalConfigurationsForm.patchValue(this.generalConfigurations);
        if (!this.generalConfigurationsForm.controls.colorDisplayType.value) {
          this.generalConfigurationsForm.get('colorDisplayType').setValue('DROP_DOWN');
        }
        if (!this.generalConfigurationsForm.controls.primaryFont.value) {
          this.generalConfigurationsForm.get('primaryFont').setValue('Lato');
        }
      })
    this.generalConfigurationsService.getCurrentEnterpriseGeneralConfigurations()
      .subscribe((response) => {
       this.id = response.sellPointId;
      });
  }

  updateGeneralConfigurations() {
    console.log('g config to save = ', this.generalConfigurationsForm.value);
    this.generalConfigurationsService.updateGeneralConfigurations(this.generalConfigurationsForm.value).subscribe((response) => {
      this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      this.generalConfigurationsForm.patchValue(response);
    });
  }

  getSellPointList() {
    this.sellPointService.getAllSellPoints().subscribe((response) => {
      this.sellPointList = response;
    });
  }


  saveConditionSellPoint() {
     this.generalConfigurationsService.updateSellPointGeneralConfiguration(this.id).subscribe((response) => {
      if(response) {
        this.matSnackbar.open(this.translateService.instant('ADMIN.GROUP.UPDATED_SUCCESS'), 'Ok', {duration: 5000});
      }
    });
  }
}
