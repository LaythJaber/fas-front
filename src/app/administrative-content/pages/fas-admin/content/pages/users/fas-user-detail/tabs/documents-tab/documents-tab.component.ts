import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-documents-tab',
  templateUrl: './documents-tab.component.html',
  styleUrls: ['./documents-tab.component.scss']
})
export class DocumentsTabComponent implements OnInit {

  formGroup: FormGroup;

  @Input() userId: number;

  constructor(private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForm();

  }

  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
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
}
