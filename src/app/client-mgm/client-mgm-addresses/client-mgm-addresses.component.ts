import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../../shared/models/client';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { ClientMgmService } from '../../shared/services/client-mgm.service';
import { ZipCode } from '../../shared/models/zip-code';
import { ZipCodeService } from '../../shared/services/zip-code.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {Address} from '../../shared/models/address';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-client-mgm-addresses',
  templateUrl: './client-mgm-addresses.component.html',
  styleUrls: ['./client-mgm-addresses.component.scss']
})
export class ClientMgmAddressesComponent implements OnInit {

  @Input() editMode = false;
  @Input() client: Client = new Client();
  form: FormGroup;
  updateForm: FormGroup;
  formStatus = "nothing_clicked" ;

  zipCodes: ZipCode[] = [] ;
  prefixList = [];
  addresses: Address[] = []
  mainAddress;
  selectedAddressId ;

  zipCodeLoading = false ;

  countryFormControl = new FormControl();
  cityFormControl = new FormControl();
  provinceFormControl = new FormControl();

  unsubscribe$ = new Subject();


  constructor(private http: HttpClient,
              private sweetAlertService: SweetAlertService,
              private formBuilder: FormBuilder ,
              private clientService: ClientMgmService ,
              private zipCodeService : ZipCodeService,
              private translate: TranslateService)
  {
    this.form = this.formBuilder.group({
      name : new FormControl(null),
      surname : new FormControl(null),
      mobile: new FormControl(null),
      mobilePrefix: new FormControl(null),
      shippingAddress: new FormControl(null),
      streetNumber: new FormControl(null),
      floor: new FormControl(null),
      apartment :  new FormControl(null),
      elevator: new FormControl(null),
      intercom: new FormControl(null),
      zipCodeId: new FormControl(null),
      notes: new FormControl(null),
      address: new FormControl(null),
      fiscalCode: new FormControl(null),
      pec: new FormControl(null),
      iva: new FormControl(null),
      codeDestination: new FormControl(null),
      enabled: new FormControl(true),
    });

    this.updateForm = this.formBuilder.group({
      name : new FormControl(null),
      surname : new FormControl(null),
      mobile: new FormControl(null),
      mobilePrefix: new FormControl("+31"),
      shippingAddress: new FormControl(null),
      streetNumber: new FormControl(null),
      floor: new FormControl(null),
      apartment :  new FormControl(null),
      elevator: new FormControl(false),
      intercom: new FormControl(null),
      zipCodeId: new FormControl(null),
      notes: new FormControl(null),
      address: new FormControl(null),
      fiscalCode: new FormControl(null),
      pec: new FormControl(null),
      iva: new FormControl(null),
      codeDestination: new FormControl(null),
      enabled: new FormControl(true),
    });
  }

  getClients() {
    this.clientService.getClientAddresses(this.client.clientId).subscribe(
      res => {
        this.addresses = res.addresses ;
        this.mainAddress = res.mainAddress;
        this.checkMainAddress();
      },
      err => {
        console.log(err)
      }
    )
  }

  ngOnInit() {
    this.form.get('address').disable();
    this.form.get('fiscalCode').disable();
    this.form.get('iva').disable();
    this.form.get('pec').disable();
    this.form.get('codeDestination').disable();

    this.form.get('zipCodeId').disable();
    this.provinceFormControl.disable();
    this.cityFormControl.disable();

    this.getClients() ;

    this.http.get<any[]>('/assets/TEL_PREFIX.json').subscribe(d => this.prefixList = d.map(element => {
      element.label = `${element.country}: ${element.prefix}`;
      return element;
    }));

    this.countryFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.form.get('zipCodeId').enable();
        this.zipCodeLoading = true;
        this.zipCodeService.getAllZipCodesByCountry(res).subscribe(d => {
          this.zipCodes = d;
          this.zipCodeLoading = false;
        });
    });
    this.form.get('zipCodeId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(
      d => {
      this.provinceFormControl.setValue(null);
      this.cityFormControl.setValue(null);
      if (d && this.zipCodes.length > 0) {
        const zipCode = this.zipCodes.filter(e => e.id === d)[0];
        this.setProvinceAndCity(zipCode);
      }
    });
  }

  add() {
    let address: Address = {
      ...this.form.value ,
      zipCode : {
        id : this.form.value.zipCodeId
      }
    }
    if (!address.mobile) {
      address.mobile = '';
      address.mobilePrefix = '';

    }
    this.clientService.addClientAddress(address ,this.client.clientId).subscribe(
      res => {
        this.sweetAlertService.success(this.translate.instant('DIALOG.ADD_SUCCESS'));
        this.getClients() ;
        this.checkMainAddress() ;
        this.deactivateform();
      },
      err => {
        console.log(err)
        this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_ADD'));
      }
    )
  }

  capSearch(term: string, item: ZipCode) {
    term = term.toLowerCase();
    return item.city.toLowerCase().startsWith(term) || item.cap.toLowerCase().startsWith(term);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  setProvinceAndCity(zc) {
    this.provinceFormControl.enable();
    this.cityFormControl.enable();
    this.provinceFormControl.setValue(zc.province);
    this.cityFormControl.setValue(zc.city);
    this.provinceFormControl.disable();
    this.cityFormControl.disable();
  }

  setBillingAddress(billingCheckBox) {
    if(billingCheckBox){
      this.form.get('address').enable();
      this.form.get('fiscalCode').enable();
      this.form.get('iva').enable();
      this.form.get('pec').enable();
      this.form.get('codeDestination').enable();
    }
    else {
      this.form.get('address').disable();
      this.form.get('fiscalCode').disable();
      this.form.get('iva').disable();
      this.form.get('pec').disable();
      this.form.get('codeDestination').disable();
    }
  }

  checkMainAddress() {
    for (let address of this.addresses) {
      address.isMain = address.addressId == this.mainAddress.addressId;
    }
  }

  onSetMainAddress(addressId){
    // this.loadingService.activate() ;
    this.clientService.updateMainAddress(addressId , this.client.clientId).subscribe(
      res => {
        for (let address of this.addresses) {
          address.isMain = address.addressId == addressId;
        }
        // this.loadingService.deactivate() ;
        console.log(res)
      },
      error => {
        // this.loadingService.deactivate() ;
      }
    )
  }

  onUpdateClick(selectedAddress) {
    console.log(selectedAddress)
    this.updateForm = this.formBuilder.group({
      name : new FormControl(selectedAddress.name),
      surname : new FormControl(selectedAddress.surname),
      mobile: new FormControl(selectedAddress.mobile),
      mobilePrefix: new FormControl(selectedAddress.mobilePrefix),
      shippingAddress: new FormControl(selectedAddress.shippingAddress),
      streetNumber: new FormControl(selectedAddress.streetNumber),
      floor: new FormControl(selectedAddress.floor),
      apartment :  new FormControl(selectedAddress.apartment),
      elevator: new FormControl(selectedAddress.elevator),
      intercom: new FormControl(selectedAddress.intercom),
      zipCodeId: new FormControl(selectedAddress.zipCodeId),
      notes: new FormControl(selectedAddress.notes),
      address: new FormControl(selectedAddress.address),
      fiscalCode: new FormControl(selectedAddress.fiscalCode),
      pec: new FormControl(selectedAddress.pec),
      iva: new FormControl(selectedAddress.iva),
      codeDestination: new FormControl(selectedAddress.codeDestination),
      enabled: new FormControl(selectedAddress.enabled),
    });

    this.updateForm.get('zipCodeId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(
      d => {
        console.log(d)
        this.provinceFormControl.setValue(null);
        this.cityFormControl.setValue(null);
        if (d && this.zipCodes.length > 0) {
          const zipCode = this.zipCodes.filter(e => e.id === d)[0];
          this.setProvinceAndCity(zipCode);
        }
      });

    this.countryFormControl.setValue(selectedAddress.zipCode.country);
    this.updateForm.get('zipCodeId').setValue(selectedAddress.zipCode.id);
    this.setProvinceAndCity(selectedAddress.zipCode)
    this.formStatus = "update_clicked" ;
    this.selectedAddressId = selectedAddress.addressId
  }

  saveUpdates() {
    let address = {
      ...this.updateForm.value ,
      addressId : this.selectedAddressId ,
      zipCode: {
        id : this.updateForm.value.zipCodeId
      }
    }

    if (!address.mobile) {
      address.mobile = '';
      address.mobilePrefix = '';

    }

    this.clientService.updateAddress(address).subscribe(
      res => {
          this.formStatus = "nothing_clicked";
          this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
          this.getClients();
      },
      error => {
        this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_UPDATE'));
      }
    )
    console.log()
  }

  activateAdd() {
    this.formStatus = "add_clicked" ;
  }

  deactivateform() {
    this.formStatus = "nothing_clicked" ;
  }

  delete(addresseId) {
    this.clientService.deleteAddress(addresseId).subscribe(
      res => {
        this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
        this.getClients() ;
      },
      error => {
        console.log(error)
        this.sweetAlertService.success(this.translate.instant('DIALOG.CANNOT_DELETE'));
      }
    )
  }

}
