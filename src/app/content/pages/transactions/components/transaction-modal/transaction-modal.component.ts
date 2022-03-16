import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Transaction} from "../../../../../shared/models/transaction/transaction";
import {TransactionService} from "../../../../../shared/services/transaction.service";
import {TransactionRow} from "../../../../../shared/models/transaction/transaction-row";

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss']
})
export class TransactionModalComponent implements OnInit {

  transaction: Transaction;
  rowList: TransactionRow[];

  constructor(
    public dialogRef: MatDialogRef<TransactionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public transactionService: TransactionService
    ) {
  }

  ngOnInit() {
    this.transaction = this.data.transaction;
    this.transactionService.getTransactionDetails(this.transaction.id).subscribe(response => {
      this.rowList = response.rowList;
    })
  }

  close() {
    this.dialogRef.close();
  }

}
