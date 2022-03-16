import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Language} from 'src/app/shared/models/language';
import {LanguageService} from 'src/app/shared/services/language.service';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SweetAlertService} from '../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-generic-translation',
  templateUrl: './generic-translation.component.html',
  styleUrls: ['./generic-translation.component.scss']
})
export class GenericTranslationComponent implements OnInit {

  languages: Language[] = [];
  internationalizationArray: FormArray = new FormArray([]);
  dialogRefTranslation: any;
  editMode;
  editClicked;

  constructor(private languageService: LanguageService,
              public dialogRef: MatDialogRef<GenericTranslationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    console.log(this.data);
    this.editMode = this.data.editMode;
    this.editClicked = this.data.editClicked;
    console.log(this.editMode);
    console.log(this.editClicked);
    if (this.data.list === null || this.data.list.length === 0) {
      this.languageService.getLanguages().subscribe(r => {
        this.languages = r;
        r.forEach(e => {
          const trans = new FormGroup({
            description: new FormControl(e ? '' : '', [Validators.required]),
            langCode: new FormControl(e.code),
            langCodeId: new FormControl(e.id)
          });
          this.internationalizationArray.push(trans);
        });
      });
    } else {
      this.data.list.sort((a, b) => a.langCode < b.langCode  ? 1 : -1);
      console.log(this.data.list);
      this.data.list.forEach(e => {
        const trans = new FormGroup({
          description: new FormControl(e.description, Validators.required),
          langCode: new FormControl(e.langCode),
          langCodeId: new FormControl(e.langCodeId)
        });
        this.internationalizationArray.push(trans);
      });
    }
    if (!this.data.editMode) {
      // tslint:disable-next-line:forin
      for (const control in this.internationalizationArray.controls) {
        this.internationalizationArray.controls[control].disable();
      }
    }
  }

  save(toSave) {
    if (toSave) {
        this.dialogRef.close(this.internationalizationArray.value);
        return;
      } else {
      this.dialogRef.close(null);
    }
  }

}
