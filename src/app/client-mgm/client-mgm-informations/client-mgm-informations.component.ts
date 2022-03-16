import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Client } from '../../shared/models/client';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { ClientMgmService } from '../../shared/services/client-mgm.service';
import {LegalInfosService} from '../../shared/services/legal-infos.service';
import {PagesInfo} from '../../shared/models/pages-info';
import {MatDialog} from '@angular/material/dialog';
import {mustMatch} from '../../shared/util/_helper';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {LoginConfiguration} from '../../shared/models/login-configuration';
import {LoginConfigurationService} from '../../shared/services/login-configuration.service';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-client-mgm-informations',
  templateUrl: './client-mgm-informations.component.html',
  styleUrls: ['./client-mgm-informations.component.scss']
})

export class ClientMgmInformationsComponent implements OnInit {

  @Output() saved = new EventEmitter<Client>();
  @Input() editMode = false;
  @Input() client: Client = new Client();
  clientForm: FormGroup;
  passwordForm: FormGroup;

  submitted = false;
  editClicked = false;

  prefixList = [];
  orderType = [ 'DELIVERY', 'CLICK_COLLECT'];
  nationalities = [];
  status = ['CONFIRMED', 'NOT CONFIRMED', 'BLOCKED'];

  pagesInfo: PagesInfo = null;
  dialogRef: any;
  loginConf: LoginConfiguration;

  constructor (
    private http: HttpClient,
    private sweetAlertService: SweetAlertService,
    private clientService: ClientMgmService,
    private legalInfosService: LegalInfosService,
    private matDialog: MatDialog,
    private loginConfigService: LoginConfigurationService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.loginConfigService.getCurrentGroupConfig().subscribe(r => {
      this.loginConf = r;
    });
    this.initForms();
  }

  initForms() {

    this.initPasswordForm();

    this.clientForm = new FormGroup({
      code: new FormControl(null),

      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null),
      gender: new FormControl(null),

      email: new FormControl(null, [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      password: new FormControl(null),
      psd: new FormControl(false),

      fiscalCode: new FormControl(),
      orderType: new FormControl(null),
      nationality: new FormControl(null),

      mobile: new FormControl(null, [Validators.pattern('^[0-9]{8}[0-9]*')]),
      mobilePrefix: new FormControl('+39'),
      home: new FormControl(),
      homePrefix: new FormControl('+39'),

      confirmed: new FormControl(false),

      newsletters: new FormControl(true),
      marketing: new FormControl(false),
      privacy: new FormControl(false),

      note: new FormControl(null),
      customField1Value: new FormControl(null),
      customField2Value: new FormControl(null),
      customField3Value: new FormControl(null),
      customField4Value: new FormControl(null)
    });

    this.http.get<any[]>('/assets/TEL_PREFIX.json').subscribe(d => this.prefixList = d.map(element => {
      element.label = `${element.country}: ${element.prefix}`;
      return element;
    }));

    this.http.get<any>('/assets/files/NATIONALITIES.json').subscribe(
      res => {
        this.nationalities = res.en;
      });

    if (this.editMode) {
      this.clientForm.patchValue(this.client);
      this.clientForm.disable();
    }

    this.getPagesInfo();
  }

  initPasswordForm() {
    this.passwordForm = new FormGroup({
      newPassword: new FormControl(null,
        [Validators.required , Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/),
          Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required]),
      npsd: new FormControl(false),
      cpsd: new FormControl(false),
    }, {validators: mustMatch('newPassword', 'confirmPassword')});
  }

  showHidePassword($event) {
    $event.stopPropagation();
    this.passwordForm.controls.npsd.setValue(!this.passwordForm.controls.npsd.value);
  }

  getPagesInfo() {
    this.legalInfosService.getPagesInfo().subscribe((response) => {
      this.pagesInfo = response;
      this.setPagesMandatory();
    });
  }

  setPagesMandatory() {
    if (this.pagesInfo.page1Mandatory) {
      this.clientForm.get('newsletters').patchValue(true);
      this.clientForm.get('newsletters').disable();
    }
    if (this.pagesInfo.page2Mandatory) {
      this.clientForm.get('marketing').patchValue(true);
      this.clientForm.get('marketing').disable();
    }
    if (this.pagesInfo.page3Mandatory) {
      this.clientForm.get('privacy').patchValue(true);
      this.clientForm.get('privacy').disable();
    }
  }

  sendRestPassword() {
    const npsd = this.passwordForm.get('newPassword').value;
    this.clientService.changeClientPassword(this.client.clientId, npsd).subscribe(
      (response) => {
        this.dialogRef.close();
        this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
      },
      (error) => {
        console.log('error psd = ', error);
        this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_UPDATE'));
      }
    );
  }

  activateEdit() {
    this.editClicked = true;
    this.clientForm.enable();
    this.setPagesMandatory();
  }

  saveClient() {
    const client: Client = {
      ... this.clientForm.value
    };
    if (!client.mobile) {
      client.mobile = '';
      client.mobilePrefix = '';
    }
    if (!client.home) {
      client.home = '';
      client.homePrefix = '';
    }
    if (client.dateOfBirth) {
      client.dateOfBirth = moment(client.dateOfBirth).format().substring(0, 10);
    }
    console.log('client to save = ', client);

    this.clientService.addClient(client).subscribe(
      (response) => {
        this.sweetAlertService.success(this.translate.instant('DIALOG.ADD_SUCCESS'));
      } ,
      (error) => {
        console.log('new  client error = ', error);
        this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_ADD'));
      }
    );
  }

  updateClient() {
    const client: Client = {
      ... this.clientForm.value ,
      clientId : this.client.clientId
    };
    if (client.dateOfBirth) {
      client.dateOfBirth = moment(client.dateOfBirth).format().substring(0, 10);
    }
    console.log('client to update = ', client);
    this.clientService.updateClient(client).subscribe(
      (response) => {
        console.log(response);
        this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
      } ,
      (error) => {
        console.log(' upd client error = ', error);
        this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_UPDATE'));
      }
    );
  }

  openPasswordModal(modal) {
    this.dialogRef = this.matDialog.open(modal, {
      width: '40%',
      autoFocus: true,
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(d => {
      this.initPasswordForm();
    });
  }
}
