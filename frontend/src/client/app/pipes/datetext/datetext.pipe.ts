import { Pipe, PipeTransform } from '@angular/core';
/**
* This class represents the main pipe component.
*/
@Pipe({name: 'datetext'})
export class DatetextPipe implements PipeTransform {
	/* MAIN TRANSFOMATION */
	transform(value:Date, args:string[]) : any {
		if(typeof value == 'string') value = new Date(value);
		let dia = (value.getDate() < 10) ? "0"+value.getDate() : value.getDate();
		let mes = ((value.getMonth()+1) < 10) ? "0"+(value.getMonth()+1) : (value.getMonth()+1);
		return dia+"/"+mes+"/"+value.getFullYear();
	}
}