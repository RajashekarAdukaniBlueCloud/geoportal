import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'noempty'})
export class NoemptyPipe implements PipeTransform {
  transform(value:string, args:string[]) : any {
    value = value.trim();
    if(!value || 0 === value.length){
    	return args;
    }
    return value;
  }
}
