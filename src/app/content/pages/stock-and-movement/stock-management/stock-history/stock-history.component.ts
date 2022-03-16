import {Component, Inject, Input, OnInit} from '@angular/core';
import {StockHistory} from '../../../../../shared/models/stock-history';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Stock} from '../../../../../shared/models/stock';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.scss']
})
export class StockHistoryComponent implements OnInit {
  @Input() data: Stock;
  rows: StockHistory[] = [];
 columns = [
   'DATA_TABLE.DATE',
   'DATA_TABLE.DESCRIPTION',
   'DATA_TABLE.COMMERCIAL_DESCRIPTION',
   'PRODUCT_FORM.MEASURE_UNIT',
   // 'DATA_TABLE.PURCHASE_COST',
   'DATA_TABLE.QUANTITY',
   'DATA_TABLE.PRICE',
   'DATA_TABLE.TOTAL',
   'DATA_TABLE.CAUSAL',
  ];

 /* columns = [
    'DATA_TABLE.DATE',
    'qtaInventory',
    'valInventory',
    'qtaStockLoad',
    'valStockLoad',
    'qtaStockPurch',
    'valStockPurch',
    'qtaStockUnload',
    'valStockUnload',
    'qtaStockSale',
    'valStockSale',
    'qtaReserved',
    'valReserved',
    'qtaOrdered',
    'valOrdered',
    'dtPriceLastSale',
    'valuePriceLastSale',
    'valuePriceAverageSale',
    'valuePriceAverageSaleMov',
    'dtPriceLastPurch',
    'valuePriceLastPurch',
    'valuePriceAveragePurch',
    'valuePriceAveragePurchMov',
    'valuePriceLowPurch',
    'valuePriceMaxPurch',
    'qtaStock',
    'qtaAvailable',
  ];
*/
  constructor() {
  }

  ngOnInit() {
    this.rows = this.data.histories;
    console.log(this.data);
  }

}
