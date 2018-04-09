import { Pipe, PipeTransform } from '@angular/core';
/**
* This class represents the main pipe component.
*/
@Pipe({name: 'run'})
export class RunPipe implements PipeTransform {
    transform(value:string, args:string[]) : any {
        if(typeof value == 'undefined') {
            return '';
        }
        
        let runArray = value.split('-');
        if(runArray.length <= 1 || runArray[0].length < 7 || runArray[1].length != 1){
            return '';
        }

        return runArray[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + runArray[1];
    }
}