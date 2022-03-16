import { Component, OnInit } from '@angular/core';
import {PluginConfigService} from "../../../../shared/services/plugin/plugin-config.service";
import {PluginConfiguration} from "../../../../shared/models/plugin/plugin-configuration";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit {

  pluginConfiguration: PluginConfiguration;

  pluginGoogleAnalyticsForm: FormGroup;
  pluginFacebookPixelForm: FormGroup;
  pluginTrustPilotForm: FormGroup;
  pluginIubendaForm: FormGroup;

  connectorFoodManagerForm: FormGroup;
  connectorSellPointForm: FormGroup;

  showPassword: boolean = false;

  constructor(
    private pluginConfigService: PluginConfigService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'PLUGIN']);
    this.initForms();
  }

  ngOnInit() {
    this.getPluginConfigurationDetails();
  }

  initForms() {
    this.pluginGoogleAnalyticsForm = new FormGroup({
      googleAnalyticId: new FormControl(null, Validators.required),
      googleAnalyticsEnabled: new FormControl(false, Validators.required),
    });
    this.pluginFacebookPixelForm = new FormGroup({
      facebookPixelId: new FormControl(null, Validators.required),
      facebookPixelEnabled: new FormControl(false, Validators.required),
    });
    this.pluginTrustPilotForm = new FormGroup({
      trustPilotBusinessUnitId: new FormControl(null, Validators.required),
      trustPilotTemplateId: new FormControl(null, Validators.required),
      trustPilotEnabled: new FormControl(false, Validators.required),
    });
    this.pluginIubendaForm = new FormGroup({
      iubendaPrivacyEnabled: new FormControl(false),
      iubendaId: new FormControl(null, Validators.required),
      iubendaCookiesEnabled: new FormControl(false),
      iubendaCookiesScript: new FormControl(null),
    });
    this.connectorFoodManagerForm = new FormGroup({
      foodManagerUrl: new FormControl(null, Validators.required),
      foodManagerEnabled: new FormControl(false, Validators.required),
      foodManagerGenericCustomerEnabled: new FormControl(false, Validators.required),
      foodManagerGenericCustomerCode: new FormControl(null),
    });
    this.connectorSellPointForm = new FormGroup({
      sellPointUrl: new FormControl(null, Validators.required),
      sellPointEnabled: new FormControl(false, Validators.required),
      sellPointGenericCustomerEnabled: new FormControl(false, Validators.required),
      sellPointGenericCustomerCode: new FormControl(null),
      sellPointUsername: new FormControl(null, Validators.required),
      sellPointPassword: new FormControl(null, Validators.required),
      sellPointCompanyId: new FormControl(null, Validators.required),
      sellPointEmployerId: new FormControl(null, Validators.required),
      sellPointStoreId: new FormControl(null, Validators.required),
      sellPointSeasonId: new FormControl(null, Validators.required)
    });
  }

  getPluginConfigurationDetails() {
    this.pluginConfigService.getPluginConfiguration().subscribe((response) => {
      this.pluginConfiguration = response;
      this.pluginGoogleAnalyticsForm.patchValue(this.pluginConfiguration);
      this.pluginFacebookPixelForm.patchValue(this.pluginConfiguration);
      this.pluginTrustPilotForm.patchValue(this.pluginConfiguration);
      this.pluginIubendaForm.patchValue(this.pluginConfiguration);
      this.connectorFoodManagerForm.patchValue(this.pluginConfiguration);
      this.connectorSellPointForm.patchValue(this.pluginConfiguration);
    });
  }

  updateGoogleAnalyticsPlugin() {
    const gid = this.pluginGoogleAnalyticsForm.get('googleAnalyticId').value;
    const ga = this.pluginGoogleAnalyticsForm.get('googleAnalyticsEnabled').value;
    this.pluginConfigService.updateGoogleAnalyticsPlugin( { id: gid, enabled: ga})
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getPluginConfigurationDetails();
      });
  }

  updateFacebookPixelPlugin() {
    const fid = this.pluginFacebookPixelForm.get('facebookPixelId').value;
    const fa = this.pluginFacebookPixelForm.get('facebookPixelEnabled').value;
    this.pluginConfigService.updateFacebookPixelPlugin( { id: fid, enabled: fa})
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getPluginConfigurationDetails();
      });
  }

  updateTrustPilotPlugin() {
    const tbi = this.pluginTrustPilotForm.get('trustPilotBusinessUnitId').value;
    const tti = this.pluginTrustPilotForm.get('trustPilotTemplateId').value;
    const ta = this.pluginTrustPilotForm.get('trustPilotEnabled').value;
    this.pluginConfigService.updateTrustPilotPlugin( { id: tbi, enabled: ta, templateId: tti})
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getPluginConfigurationDetails();
      });
  }

  updateIubendaPlugin() {
    const iid = this.pluginIubendaForm.get('iubendaId').value;
    const ipa = this.pluginIubendaForm.get('iubendaPrivacyEnabled').value;
    const ica = this.pluginIubendaForm.get('iubendaCookiesEnabled').value;
    const ics = this.pluginIubendaForm.get('iubendaCookiesScript').value;
    this.pluginConfigService.updateIubendaPlugin( { id: iid, enabled: ipa, cookiesEnabled: ica, cookiesScript: ics})
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getPluginConfigurationDetails();
      });
  }

  updateFoodManagerConnector() {
    const fmu = this.connectorFoodManagerForm.get('foodManagerUrl').value;
    const fma = this.connectorFoodManagerForm.get('foodManagerEnabled').value;
    const fmgca = this.connectorFoodManagerForm.get('foodManagerGenericCustomerEnabled').value;
    const fmgcc = this.connectorFoodManagerForm.get('foodManagerGenericCustomerCode').value;
    this.pluginConfigService.updateFoodManagerConnector( { id: fmu, enabled: fma, foodManagerGenericCustomerEnabled: fmgca,
    foodManagerGenericCustomerCode: fmgcc})
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getPluginConfigurationDetails();
      });
  }

  updateSellPointConnector() {
    const spu = this.connectorSellPointForm.get('sellPointUrl').value;
    const spa = this.connectorSellPointForm.get('sellPointEnabled').value;
    const spgca = this.connectorSellPointForm.get('sellPointGenericCustomerEnabled').value;
    const spgcc = this.connectorSellPointForm.get('sellPointGenericCustomerCode').value;
    const spun = this.connectorSellPointForm.get('sellPointUsername').value;
    const spps = this.connectorSellPointForm.get('sellPointPassword').value;
    const spcid = this.connectorSellPointForm.get('sellPointCompanyId').value;
    const spsid = this.connectorSellPointForm.get('sellPointStoreId').value;
    const speid = this.connectorSellPointForm.get('sellPointEmployerId').value;
    const spssid = this.connectorSellPointForm.get('sellPointSeasonId').value;
    this.pluginConfigService.updateSellPointConnector( { id: spu, enabled: spa, sellPointGenericCustomerEnabled: spgca,
      sellPointGenericCustomerCode: spgcc, sellPointUsername: spun, sellPointPassword: spps,
      sellPointCompanyId: spcid, sellPointStoreId: spsid, sellPointEmployerId: speid, sellPointSeasonId: spssid})
      .subscribe((response) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getPluginConfigurationDetails();
      });
  }

}
