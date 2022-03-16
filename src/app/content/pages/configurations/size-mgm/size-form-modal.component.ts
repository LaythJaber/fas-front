import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {SizeService} from 'src/app/shared/services/size.service';
import {Size, SizeSchema} from '../../../../shared/models/size';

@Component({
  selector: 'app-size-form-modal',
  templateUrl: './size-form-modal.component.html',
  styleUrls: ['./size-mgm.component.scss']
})
export class SizeFormModalComponent implements OnInit {
  sizeForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);
  @ViewChild('descInput') descInput: ElementRef;
  size: Size;
  columns = [
    'DATA_TABLE.CODE',
    'DATA_TABLE.DESCRIPTION',
    'step',
    'alias',
  ];
  selectedSchema: SizeSchema;
  schemaForm: FormGroup;
  private dial: MatDialogRef<unknown, any>;

  constructor(public dialogRef: MatDialogRef<SizeFormModalComponent>,
              private sizeService: SizeService,
              public dialogSchema: MatDialog,
              private snackBar: MatSnackBar,
              private sweetAlertService: SweetAlertService,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.size = new Size();
    this.sizeForm = new FormGroup({
      id: new FormControl(),
      code: new FormControl(),
      description: new FormControl(null, [Validators.required]),
      descriptionWeb: new FormControl(),
      enabled: new FormControl(false),
      schemas: new FormControl(),
    });
    if (this.data.editMode) {
      this.size = this.data.size;
      this.sizeForm.patchValue(this.data.size);
    }
  }

  initSchemaForm() {
    this.schemaForm = new FormGroup({
      id: new FormControl(),
      code: new FormControl(),
      description: new FormControl(null, [Validators.required]),
      step: new FormControl(),
      alias: new FormControl(),
    });
  }


  save() {
    this.submitted = true;
    if (!this.sizeForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.sizeForm.get('schemas').setValue(this.size.schemas);
    this.sizeService.updateSize(this.sizeForm.getRawValue()).subscribe(d => {
      this.dialogRef.close(d);
    }, (err) => {
      this.sizeForm.get('description').enable();
      this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
    }, () => {
      this.sizeForm.get('description').enable();
      this.sizeForm.get('description').setValue(null);
      this.submitted = false;
      this.descInput.nativeElement.focus();
    });
  }

  deleteSchema(schema: SizeSchema, $event: MouseEvent) {
    $event.stopPropagation();
    const index = this.size.schemas.indexOf(schema);
    if (index !== -1) {
      this.size.schemas.splice(index, 1);
    }
  }

  getSelectedSchema(schema: SizeSchema, $event: MouseEvent, schemaContent) {
    $event.stopPropagation();
    this.selectedSchema = schema;
    this.initSchemaForm();
    if (schema) {
      this.schemaForm.patchValue(schema);
    }
    this.dial = this.dialogSchema.open(schemaContent, {width: '800px'});
  }

  saveSchema() {
    if (this.schemaForm.get('id').value) {
      const index = this.size.schemas.indexOf(this.selectedSchema);
      if (index !== -1) {
        this.size.schemas[index] = this.schemaForm.value;
        this.selectedSchema = null;
      }
      this.dial.close();
      return;
    }
    this.size.schemas = [this.schemaForm.value, ...this.size.schemas];
    this.dial.close();

  }
}
