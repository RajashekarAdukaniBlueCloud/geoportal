import { Pipe, PipeTransform } from '@angular/core';
import { _MINUS_LIST } from './minus_list';

@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {

    transform(value: any) {
        if (typeof value == 'undefined') {
            return '';
        }

        var output = '';
        value.split(' ').forEach((element: string) => {
            if (_MINUS_LIST.indexOf(element.toLowerCase()) != -1) {
                output += ' ' + element.toLowerCase();
            } else {
                output += ' ' + element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
            }
        });

        return output;
    }
}
