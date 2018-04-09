import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'CLP'})
export class ClpPipe implements PipeTransform {
  transform(value:string, args:string[]) : any {
    value = '$'+value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return value;
  }
}
