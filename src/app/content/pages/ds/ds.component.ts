import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {BreadcrumbService} from "../../../core/services/breadcrumb.service";

@Component({
  selector: 'app-ds',
  templateUrl: './ds.component.html',
  styleUrls: ['./ds.component.scss']
})
export class DsComponent implements OnInit {

  formGroup: FormGroup;

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private _formBuilder: FormBuilder,
              private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.sendBreadCrumb();
    this.initForm();

  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['DS']);
  }


  initForm() {
    this.formGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          bac: [''],
        }),
        this._formBuilder.group({
          transcript: ['']
        }),
        this._formBuilder.group({
          certificate: ['']
        }),
        this._formBuilder.group({
          passport: ['']
        }),
        this._formBuilder.group({
          internships: ['']
        }),
        this._formBuilder.group({
          recommendations: ['']
        }),
        this._formBuilder.group({
          other: ['']
        }),
      ])
    });
  }

}
