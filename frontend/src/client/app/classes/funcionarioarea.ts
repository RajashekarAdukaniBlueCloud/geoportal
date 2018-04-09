import { FuncionarioCalidad } from "./funcionariocalidad";

/*
* This class represents the class definition.
*/
export class FuncionarioArea {
	public CODAREA: number;
	public AREA: string;
	public TOTAL: number;
	public CALIDADES: FuncionarioCalidad[];
	/* CONSTRUCTOR */
	constructor(data:any = null) {
		if(data != null){
			this.CODAREA = data.CODAREA;
			this.AREA = data.AREA;
			this.TOTAL = data.TOTAL;
			this.CALIDADES = [];
			for(let key in data.CALIDADES){
				this.CALIDADES.push(new FuncionarioCalidad(data.CALIDADES[key]));
			}
		}
	}

}