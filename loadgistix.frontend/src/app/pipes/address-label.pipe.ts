import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressLabel',
  standalone: true,
})
export class AddressLabelPipe implements PipeTransform {

  transform(value: string, character: string): any {
    let arr = value ? (value.split(character) ? value.split(character) : '') : '';
    return arr.length > 1 ? arr[0] + ',' + arr[1] : value;
  }

}