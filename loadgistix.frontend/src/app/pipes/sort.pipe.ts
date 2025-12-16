import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'order_by',
  standalone: true,
})
export class SortPipe implements PipeTransform {

  transform(value: any, propName: string) {
    return value.sort((a,b) => {
      if(a[propName] < b[propName]) {
        return -1
      }
      else if (a[propName] === b[propName]) {
        return 0;
      }
      else if(a[propName] > b[propName]) {
        return 1;
      }
    });
  }
}