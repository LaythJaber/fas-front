import { Component, Inject, Input, OnInit } from '@angular/core';
import { Stock } from 'src/app/shared/models/stock';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StockHistory } from 'src/app/shared/models/stock-history';
import { ProductMgmService } from 'src/app/shared/services/product-mgm.service';

@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html',
  styleUrls: ['./product-history.component.scss']
})
export class ProductHistoryComponent implements OnInit {

  history: StockHistory[]=[];
  loading: boolean = false;

  columns = [
    'DATA_TABLE.DATE',

    'DATA_TABLE.QTASTOCKPURCH',
    'DATA_TABLE.VALSTOCKPURCH',

    'DATA_TABLE.QTASTOCKSALE',
    'DATA_TABLE.VALSTOCKSALE',

   /* 'DATA_TABLE.DTPRICELASTSALE',
    'DATA_TABLE.VALUEPRICELASTSALE',
    'DATA_TABLE.VALUEPRICEAVERAGESALE',
    'DATA_TABLE.VALUEPRICEAVERAGESALEMOV',
    'DATA_TABLE.DTPRICELASTPURCH',
    'DATA_TABLE.VALUEPRICELASTPURCH',
    'DATA_TABLE.VALUEPRICEAVERAGEPURCH',
    'DATA_TABLE.VALUEPRICEAVERAGEPURCHMOV',

    'DATA_TABLE.QTASTOCK',
    'DATA_TABLE.QTAAVAILABLE',*/
  ]

  constructor(private productService: ProductMgmService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.loading = true;
    this.productService.getHistoryById(this.data.id).subscribe(r => {
      this.history = r;
      this.loading = false;
    })
  }

}
