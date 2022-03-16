import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Language} from "../../../../../shared/models/language";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfigurationsService} from "../../../../../shared/services/configurations.service";
import {SweetAlertService} from "../../../../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LanguageService} from "../../../../../shared/services/language.service";
import {TranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {ShipmentCost} from "../../../../../shared/models/shipment/shipment-cost";
import {ShipmentTranslation} from "../../../../../shared/models/shipment/shipment-translation";
import {Shipment} from "../../../../../shared/models/shipment/shipment";
import {ShipmentService} from "../../../../../shared/services/shipment.service";

@Component({
  selector: 'app-shipment-form',
  templateUrl: './shipment-form.component.html',
  styleUrls: ['./shipment-form.component.scss']
})
export class ShipmentFormComponent implements OnInit {
  @ViewChild('descriptionInput') nameInput: ElementRef;

  shipmentForm: FormGroup;
  shipmentCostForm: FormGroup;
  shipmentCostList: ShipmentCost[] = [];
  updatedCostIndex: number = -1;
  shipmentTranslationList: ShipmentTranslation[] = [];
  shipmentDescriptionList: String[] = [];
  shipmentNoteList: String[] = [];

  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);

  languageList: Language[] = [];
  activeLanguage: Language;
  modalRef: any;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ShipmentFormComponent>,
    private configurationsService: ConfigurationsService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private languageService: LanguageService,
    public translationLoaderService: TranslationLoaderService,
    private matDialog: MatDialog,
    private shipmentService: ShipmentService
  ) { }

  ngOnInit() {
    this.getLanguageList();
    this.initForms();
  }

  initForms() {
    this.initShipmentForm();
    this.initShipmentCostForm();

    if (this.data.editMode) {
      this.shipmentForm.patchValue(this.data.shipment);
      this.shipmentCostList = this.data.shipment.shipmentCostList;
      this.shipmentTranslationList = this.data.shipment.transInfo;
    }
  }

  initShipmentForm() {
    this.shipmentForm = new FormGroup({
      id: new FormControl(null),
      description: new FormControl(null, Validators.required),
      deliveryTime: new FormControl(null),
      shippingFees: new FormControl(false, Validators.required),
      shippingCosts: new FormControl(0),
      enabled: new FormControl(true),
      note: new FormControl(null),
    });
  }


  initShipmentCostForm() {
    this.shipmentCostForm = new FormGroup({
      id: new FormControl(null),
      type: new FormControl('COST', Validators.required),
      cost: new FormControl(0, Validators.required),
      minExpense: new FormControl(0, Validators.required),
      maxExpense: new FormControl(0, Validators.required),
    });
  }

  getLanguageList() {
    this.languageService.getLanguages().subscribe(r => {
      this.languageList = r;
      const siteActiveLanguage = this.translationLoaderService.getActiveLanguage();
      const indexActiveLanguage = this.languageList.findIndex(l => l.code.toUpperCase() === siteActiveLanguage.toUpperCase());
      if (indexActiveLanguage != -1) {
        this.activeLanguage = this.languageList[indexActiveLanguage];
        this.languageList = this.languageList.filter( l => l.code.toUpperCase() !== siteActiveLanguage.toUpperCase());
        this.shipmentDescriptionList = new Array(this.languageList.length);
        this.shipmentNoteList = new Array(this.languageList.length);
        if (this.data.editMode) {
          const st: ShipmentTranslation = this.data.shipment.transInfo.find(t => t.language.id === this.activeLanguage.id);
          if (st) {
            this.shipmentForm.get('description').setValue(st.description);
            this.shipmentForm.get('note').setValue(st.note);
          }
          this.shipmentTranslationList = this.shipmentTranslationList.filter(t => t.language.id !== this.activeLanguage.id);
          for (let i=0; i<this.shipmentTranslationList.length; i++) {
            const t = this.shipmentTranslationList[i];
            const index = this.languageList.findIndex(l => l.id === t.language.id);
            if (index !== -1) {
              this.shipmentDescriptionList[index] = t.description;
              this.shipmentNoteList[index] = t.note;
            }
          }
        }
      }
    });
  }

  save() {
    this.submitted = true;
    if (!this.shipmentForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {});
      return;
    }
    this.shipmentForm.disable();
    this.addedElement = true;
    if (!this.data.editMode) {
      let shipment : Shipment = {
        ... this.shipmentForm.value
      };

      if (this.activeLanguage) {
        const st: ShipmentTranslation = new ShipmentTranslation();
        st.description = this.shipmentForm.get('description').value;
        st.note = this.shipmentForm.get('note').value;
        st.language = this.activeLanguage;
        this.shipmentTranslationList.push(st);
      }

      shipment.transInfo = this.shipmentTranslationList;
      shipment.shipmentCostList = this.shipmentCostList;

      this.shipmentService.addShipment(shipment).subscribe(
        (response) => {
          if (!this.addMultipleCheckbox.value) {
            this.dialogRef.close(response);
          }
          else {
            this.shipmentCostList = [];
            this.shipmentForm.enable();
            this.ngOnInit();
          }
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok',
            {duration: 5000, panelClass: 'white-snackbar'});
        },
        (error) => {
          console.log('add shipment error = ', error);
          this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok',
            {duration: 5000});
        },
        () => {
          this.submitted = false;
          this.shipmentForm.enable();
          this.nameInput.nativeElement.focus();
        }
      );
    }
    else {
      let shipment : Shipment = {
        ... this.shipmentForm.value
      };

      if (this.activeLanguage) {
        const st: ShipmentTranslation = new ShipmentTranslation();
        st.description = this.shipmentForm.get('description').value;
        st.note = this.shipmentForm.get('note').value;
        st.language = this.activeLanguage;
        this.shipmentTranslationList.push(st);
      }

      shipment.transInfo = this.shipmentTranslationList;
      shipment.shipmentCostList = this.shipmentCostList;

      this.shipmentService.updateShipment(shipment).subscribe(
        (response) => {
          this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
          this.dialogRef.close(true);
        },
        (error) => {
          console.log('update shipment error = ', error);
          this.shipmentForm.enable();
          this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
        },
        () => {
        }
      );
    }

  }


  /**********************************************/

  openAddCost(modal) {
    this.updatedCostIndex = -1;
    this.openCostModal(modal);
  }

  openEditCost(modal, cost: ShipmentCost, i: number) {
    this.shipmentCostForm.patchValue(cost);
    this.updatedCostIndex = i;
    this.openCostModal(modal);
  }

  openCostModal(modal) {
    this.modalRef = this.matDialog.open(modal, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
    this.modalRef.afterClosed().subscribe((d) => {
      console.log('d = ', d);
    });
  }

  saveCost() {
    const shipmentCost: ShipmentCost = new ShipmentCost();
    shipmentCost.id = this.shipmentCostForm.get('id').value;
    shipmentCost.type = this.shipmentCostForm.get('type').value;
    shipmentCost.cost = this.shipmentCostForm.get('cost').value;
    shipmentCost.minExpense = this.shipmentCostForm.get('minExpense').value;
    shipmentCost.maxExpense = this.shipmentCostForm.get('maxExpense').value;
    console.log('shipCost = ', shipmentCost);
    if (this.updatedCostIndex === -1) {
      this.shipmentCostList.push(shipmentCost);
    }
    else {
      this.shipmentCostList[this.updatedCostIndex] = shipmentCost;
    }
    this.modalRef.close();
    this.initShipmentCostForm();
  }

  deleteCost(i:number) {
    this.shipmentCostList.splice(i, 1);
  }


  /************************************/


  openTranslationModal(modal) {
    this.modalRef = this.matDialog.open(modal, {
      width: '600px',
      autoFocus: true,
      disableClose: true,
    });
    this.modalRef.afterClosed().subscribe((d) => {
      console.log('d = ', d);
    });
  }

  saveDescriptionTranslation() {
    for (let i =0; i< this.shipmentDescriptionList.length; i++) {
      const des = this.shipmentDescriptionList[i];
      if (des && des.trim()) {
        const st: ShipmentTranslation = new ShipmentTranslation();
        st.description = des.trim();
        st.language = this.languageList[i];

        const index = this.shipmentTranslationList.findIndex(t => t.language.id === this.languageList[i].id);
        if (index === -1) {
          this.shipmentTranslationList.push(st);
        }
        else {
          this.shipmentTranslationList[index].description = des.trim();
        }
      }
    }
    this.modalRef.close();
  }

  saveNoteTranslation() {
    for (let i =0; i< this.shipmentNoteList.length; i++) {
      const note = this.shipmentNoteList[i];
      if (note && note.trim()) {
        const st: ShipmentTranslation = new ShipmentTranslation();
        st.note = note.trim();
        st.language = this.languageList[i];

        const index = this.shipmentTranslationList.findIndex(t => t.language.id === this.languageList[i].id);
        if (index === -1) {
          this.shipmentTranslationList.push(st);
        }
        else {
          this.shipmentTranslationList[index].note = note.trim();
        }
      }
    }
    this.modalRef.close();
  }


  @HostListener('document:keydown.escape')
  onEscapeBtnClick() {
    this.dialogRef.close(this.addedElement);
  }

}
