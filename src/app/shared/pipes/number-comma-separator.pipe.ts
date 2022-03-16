import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'numberCommaseparator',
})
export class NumberCommaseparatorlPipe implements PipeTransform {
	transform(value: string): string {
		return value ? value.replace('.', ',') : '';
	}
}
