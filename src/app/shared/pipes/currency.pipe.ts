import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number): any {
    if (value != null) {
      return value.toFixed(2).replace(',', '.');
    }
  }

}
