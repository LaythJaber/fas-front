import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-barcode-authentication',
  templateUrl: './barcode-authentication.component.html',
  styleUrls: ['./barcode-authentication.component.scss']
})
export class BarcodeAuthenticationComponent implements OnInit {
  barcodeForm = new FormGroup({
    barcode: new FormControl(null)
  });
  submitted = false;
  constructor(private matDialogRef: MatDialogRef<BarcodeAuthenticationComponent>) { }

  ngOnInit() {
  }

  submitBarcode() {
    this.submitted = true;
    setTimeout(() => {
      this.matDialogRef.close(this.barcodeForm.value.barcode);
    }, 1500);
  }
}
