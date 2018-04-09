/*
* This class represents the class definition.
*/
export class FuncionarioCalidad {
	public CODCALIDAD: number;
	public CALIDAD: string;
	public TOTAL: number;
	/* CONSTRUCTOR */
	constructor(calidad:any = null) {
		if(calidad){
			this.CODCALIDAD = calidad.CODCALIDAD;
			this.CALIDAD = calidad.CALIDAD;
			this.TOTAL = calidad.TOTAL;
			return this;
		}
		this.TOTAL = 0;
	}
	
}