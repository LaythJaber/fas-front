import {Component, OnInit} from '@angular/core';
import {SaleAppService} from "../../../../../../shared/services/sale-app/sale-app.service";
import {SaleApp} from "../../../../../../shared/models/sale-app/sale-app";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-sale-app',
  templateUrl: './sale-app.component.html',
  styleUrls: ['./sale-app.component.scss']
})
export class SaleAppComponent implements OnInit {

  saleApp: SaleApp;

  // google
  googleConfig: any;
  moduleGoogleMerchantForm: FormGroup;
  googleMerchantInfoFile: {name: string, file: File} = {name: null, file: null};
  googleMerchantServiceAccountFile: {name: string, file: File} = {name: null, file: null};

  // ebay
  ebayLoading: boolean = false;
  ebayConfig: any;
  ebayForm: FormGroup;
  ebayConfigFile: {name: string, file: File} = {name: null, file: null};
  modal: any;

  // amazon
  amazonConfig: any;
  amazonForm: FormGroup;

  constructor(
    private saleAppService: SaleAppService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {
    this.initForms();
  }

  ngOnInit() {
    this.getSaleApp();
  }

  initForms() {
    this.moduleGoogleMerchantForm = new FormGroup({
      id: new FormControl(null),
      googleMerchantUserId: new FormControl(null, Validators.required),
      googleMerchantDomain: new FormControl(null, Validators.required),
      googleMerchantEnabled: new FormControl(false, Validators.required),
    });

    this.ebayForm = new FormGroup({
      id: new FormControl(null),
      uuid: new FormControl(null),
      enabled: new FormControl(false, Validators.required),
      clientId: new FormControl(null, Validators.required),
      paymentPolicyId: new FormControl(null, Validators.required),
      shippingPolicyId: new FormControl(null, Validators.required),
      returnPolicyId: new FormControl(null, Validators.required),
      merchantLocationKey: new FormControl(null, Validators.required),
      authCode: new FormControl(null),
      refreshToken: new FormControl(null)
    });

    this.amazonForm = new FormGroup({
      id: new FormControl(null),
      uuid: new FormControl(null),
      enabled: new FormControl(false, Validators.required),
      sellerId: new FormControl(null, Validators.required),
      clientId: new FormControl(null, Validators.required),
      clientSecret: new FormControl(null, Validators.required),
      refreshToken: new FormControl(null, Validators.required),
      accessKeyId: new FormControl(null, Validators.required),
      secretKey: new FormControl(null, Validators.required),
      region: new FormControl(null, Validators.required),
      roleArn: new FormControl(null, Validators.required),
    });

  }

  getSaleApp() {
    this.saleAppService.getSaleApp().subscribe((response)=> {
      console.log('current saleApp = ', response);
      this.saleApp = response;
      if (this.saleApp.googleMerchantUserId != null) {
        this.getGoogleConfig(this.saleApp.googleMerchantUserId);
      }
      if (this.saleApp.ebayUuid != null) {
        this.getEbayConfig(this.saleApp.ebayUuid);
      }
      if (this.saleApp.amazonUuid != null) {
        this.getAmazonConfig(this.saleApp.amazonUuid);
      }
    });
  }



  /*************** google functions ************/

  getGoogleConfig(merchantId: string) {
    this.saleAppService.getGoogleConfig(merchantId).subscribe((response) => {
      this.googleConfig = response;

      this.moduleGoogleMerchantForm.get('googleMerchantUserId').patchValue(this.googleConfig.merchantId);
      this.moduleGoogleMerchantForm.get('googleMerchantDomain').setValue(this.googleConfig.domain);
      this.moduleGoogleMerchantForm.get('googleMerchantEnabled').setValue(this.googleConfig.enabled);

      this.googleMerchantInfoFile.name = this.googleConfig.merchantInfoFile;
      this.googleMerchantServiceAccountFile.name = this.googleConfig.serviceAccountFile;

    });
  }

  updateGoogleMerchant() {
    const id = this.moduleGoogleMerchantForm.get('id').value;
    const gmid = this.moduleGoogleMerchantForm.get('googleMerchantUserId').value;
    const gmd = this.moduleGoogleMerchantForm.get('googleMerchantDomain').value;
    const gma = this.moduleGoogleMerchantForm.get('googleMerchantEnabled').value;

    this.saleAppService.updateGoogleMerchant({id: gmid, googleMerchantDomain: gmd, enabled:gma})
      .subscribe(() => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.getSaleApp();
      });

    const request = new FormData();
    if (this.googleMerchantInfoFile.file) {
      request.append('merchant-info', this.googleMerchantInfoFile.file);
    }
    if (this.googleMerchantServiceAccountFile.file) {
      request.append('service-account', this.googleMerchantServiceAccountFile.file);
    }
    const user = {id: id, merchantId: gmid, domain: gmd, enabled: gma};
    request.append('user', new Blob([JSON.stringify(user)], {type: 'application/json'}));
    this.saleAppService.updateGoogleMerchantFiles(request)
      .subscribe((response) => {
        console.log("response upload files = ", response);
      });
  }


  /****************** ebay functions **********************/

  getEbayConfig(uuid: string) {
    this.saleAppService.getEbayConfig(uuid).subscribe((response) => {
      this.ebayConfig = response;
      this.ebayForm.patchValue(this.ebayConfig);
      this.ebayConfigFile.name = this.ebayConfig.configFile;
    });
  }

  updateEbayConfig() {
    this.ebayLoading = true;
    const request = new FormData();
    if (this.ebayConfigFile.file) {
      request.append('config-file', this.ebayConfigFile.file);
    }
    const user = this.ebayForm.getRawValue();
    request.append('user', new Blob([JSON.stringify(user)], {type: 'application/json'}));
    this.saleAppService.updateEbayConfig(request).subscribe((response: any) => {
      console.log("response ebay config = ", response);
      this.ebayLoading = false;
      this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
      this.saleAppService.updateEbay({id: response.uuid, enabled: response.enabled})
        .subscribe(() => {
          this.getSaleApp();
        });
      }, () => {
      this.snackBar.open(this.translate.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
      this.ebayLoading = false;
    });
  }

  generateEbayAuthCode(ebayConfigFile: string) {
    console.log('ebay configFile = ', ebayConfigFile);
    this.saleAppService.getEbayAuthUri(ebayConfigFile).subscribe((response) => {
      console.log('url = ', response);
      let w: any;
      w = window.open(response.url, 'winname', 'width=400,height=350,location=yes,status=yes');
      w.focus();
      console.log("w = ", w.location.href);

      w.addEventListener('loadstart',  () => {
        const url  = w.location.href;
        console.log('url window = ', url);
      });

    });
  }

  generateEbayRefreshToken(uuid: string) {
    this.saleAppService.updateEbayTokens(uuid, this.ebayForm.get('authCode').value).subscribe(() => {
      this.ebayForm.get('authCode').setValue(null);
      this.getEbayConfig(this.saleApp.ebayUuid);
      this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
    });
  }

  /****************** amazon functions **********************/

  getAmazonConfig(uuid: string) {
    this.saleAppService.getAmazonConfig(uuid).subscribe((response) => {
      this.amazonConfig = response;
      this.amazonForm.patchValue(this.amazonConfig);
    });
  }

  updateAmazonConfig() {
    const request = this.amazonForm.getRawValue();
    this.saleAppService.updateAmazonConfig(request)
      .subscribe((response: any) => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.saleAppService.updateAmazon({id: response.uuid, enabled: response.enabled})
          .subscribe(() => {
            this.getSaleApp();
          });
      });
  }




  /**************** upload files ************/

  onFileSelected(event, type) {
    const file:File = event.target.files[0];
    if (file) {
      if (type === 'INFO_FILE') {
        this.googleMerchantInfoFile.file = file;
        this.googleMerchantInfoFile.name = file.name;
      }
      if (type === 'SERVICE_FILE') {
        this.googleMerchantServiceAccountFile.file = file;
        this.googleMerchantServiceAccountFile.name = file.name;
      }
      if (type === 'EBAY_FILE') {
        this.ebayConfigFile.file = file;
        this.ebayConfigFile.name = file.name;
      }
    }
  }

}
