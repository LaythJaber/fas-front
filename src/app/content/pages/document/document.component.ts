import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BreadcrumbService} from "../../../core/services/breadcrumb.service";
import {Observable} from "rxjs";
import {FileUploadService} from "../../../shared/services/file-upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  formGroup: FormGroup;

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }



  constructor(private _formBuilder: FormBuilder,
              private breadcrumbService: BreadcrumbService,

             ) { }

  ngOnInit() {

    this.sendBreadCrumb();
    this.initForm();
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
      ])
    });
  }







  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['DOCUMENTS']);
  }

}
