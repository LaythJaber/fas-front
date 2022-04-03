import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BreadcrumbService} from "../../../core/services/breadcrumb.service";
import {DsService} from "../../../shared/services/ds.service";

@Component({
  selector: 'app-ds',
  templateUrl: './ds.component.html',
  styleUrls: ['./ds.component.scss']
})
export class DsComponent implements OnInit {

  formGroup: FormGroup;

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private _formBuilder: FormBuilder,
              private breadcrumbService: BreadcrumbService,
              private dsService: DsService) {}

  ngOnInit() {
    this.sendBreadCrumb();
    this.initForm();
    this.getUserForm();

  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['DS']);
  }


  initForm() {
    this.formGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          id: new FormControl(),
          applicantSurname: new FormControl(),
          applicantName: new FormControl(),
          applicantSex: new FormControl(),
          applicantMartialStatus: new FormControl(),
          applicantDateOfBirth: new FormControl(),
          applicantPlaceOfBirth: new FormControl(),
          applicantCity: new FormControl(),
          applicantState: new FormControl(),
          applicantCountry: new FormControl()
        }),
        this._formBuilder.group({
          applicantOriginCountry: new FormControl(),
          applicantOtherNat: new FormControl(),
          applicantOtherNatContent: new FormControl(),
          applicantOtherPass: new FormControl(),
          applicantOtherPassContent: new FormControl(),
          applicantPermitOtherCountry: new FormControl(),
          applicantPermitOtherCountryContent: new FormControl(),
          applicantNationalIdentificationNumber: new FormControl(),
          applicantPurposeTrip: new FormControl(),
          applicantRelatives: new FormControl(),
          applicantRelativesContent: new FormControl(),
        }),
        this._formBuilder.group({
          applicantTravelHistory: new FormControl(),
          applicantTravelHistoryContent: new FormControl(),
          payerSurname: new FormControl(),
          payerName: new FormControl(),
          payerNumber: new FormControl(),
          payerEmail: new FormControl(),
          payerRelationship: new FormControl(),
          payerSameAddress: new FormControl(),
          payerSamerAddressContent: new FormControl(),
          payerStreetAddress: new FormControl(),
          payerCity: new FormControl(),
          payerState: new FormControl(),
          payerZipCode: new FormControl(),
          payerCountry: new FormControl(),

        }),
        this._formBuilder.group({
          companion: new FormControl(),
          companionSurname: new FormControl(),
          companionName: new FormControl(),
          companionRelationship: new FormControl(),
          applicantVisitedUs: new FormControl(),
          applicantUsVisa: new FormControl(),
          applicantUsVisaDate: new FormControl(),
          applicantVisanNumber: new FormControl(),
          applicantRejectedVisa: new FormControl(),
          applicantRejectedVisaContent: new FormControl(),
          applicantImmigrantPetition: new FormControl(),
          applicantImmigrantPetitionContent: new FormControl(),
        }),
        this._formBuilder.group({
          stateAddress: new FormControl(),
          city: new FormControl(),
          state: new FormControl(),
          zipCode: new FormControl(),
          country: new FormControl(),
          applicantPhone: new FormControl(),
          applicantEmail: new FormControl(),
          applicantSocial: new FormControl(),
          applicantSocialContent: new FormControl(),
        }),
        this._formBuilder.group({
          applicantPassportNumber: new FormControl(),
          applicantPassportCountry: new FormControl(),
          applicantPassportIssuanceDate: new FormControl(),
          applicantPassportExpirationDate: new FormControl(),
          applicantLostPassport: new FormControl(),
          applicantLostPassportContent: new FormControl(),
        }),
        this._formBuilder.group({
          fatherSurname: new FormControl(),
          fatherName: new FormControl(),
          fatherBirthDate: new FormControl(),
          fatherAlive: new FormControl(),
          fatherStreetAddress: new FormControl(),
          fatherCity: new FormControl(),
          fatherState: new FormControl(),
          fatherZipCode: new FormControl(),
          fatherCountry: new FormControl(),
          fatherUsa: new FormControl(),
          motherSurname: new FormControl(),
          motherName: new FormControl(),
          motherBirthDate: new FormControl(),
          motherAlive: new FormControl(),
          motherStreetAddress: new FormControl(),
          motherCity: new FormControl(),
          motherState: new FormControl(),
          motherZipCode: new FormControl(),
          motherCountry: new FormControl(),
          motherUsa: new FormControl(),
          applicantOtherRelativesUsa: new FormControl(),
        }),
        this._formBuilder.group({
          applicantPrimaryOccupation: new FormControl(),
          applicantPresentEmployerOrSchool: new FormControl(),
          empStreetAddress: new FormControl(),
          empCity: new FormControl(),
          empState: new FormControl(),
          empZipCode: new FormControl(),
          empCountry: new FormControl(),
          applicantPreviousEmployerOrSchool: new FormControl(),
          applicantPreviousPosition: new FormControl(),
          empPreviousStreetAddress: new FormControl(),
          empPreviousCity: new FormControl(),
          empPreviousState: new FormControl(),
          empPreviousZipCode: new FormControl(),
          empPreviousCountry: new FormControl(),
        }),
        this._formBuilder.group({
          applicantHsName: new FormControl(),
          applicantHsStreetAddress: new FormControl(),
          applicantHsCity: new FormControl(),
          applicantHsState: new FormControl(),
          applicantHsZipCode: new FormControl(),
          applicantHsCountry: new FormControl(),
          applicantHsDateFrom: new FormControl(),
          applicantHsDateTo: new FormControl(),
          applicantLanguage: new FormControl(),
          applicantTravelOtherCountries: new FormControl(),
          applicantTravelOtherCountriesContent: new FormControl(),
        }),
      ])
    });
  }

  submit() {

    const ds = {
      ... this.formArray?.get([0]).value,
      ... this.formArray?.get([1]).value,
      ... this.formArray?.get([2]).value,
      ... this.formArray?.get([3]).value,
      ... this.formArray?.get([4]).value,
      ... this.formArray?.get([5]).value,
      ... this.formArray?.get([6]).value,
      ... this.formArray?.get([7]).value,
      ... this.formArray?.get([8]).value,
    }

    this.dsService.updateDs(ds).subscribe(response => {
    });

  }

  getUserForm() {
    this.dsService.getDs().subscribe( response => {
     this.formArray?.get([0]).patchValue(response);
     this.formArray?.get([1]).patchValue(response);
     this.formArray?.get([2]).patchValue(response);
     this.formArray?.get([3]).patchValue(response);
     this.formArray?.get([4]).patchValue(response);
     this.formArray?.get([5]).patchValue(response);
     this.formArray?.get([6]).patchValue(response);
     this.formArray?.get([7]).patchValue(response);
     this.formArray?.get([8]).patchValue(response);
    })
  }

}
