import { FuncionarioCalidad } from './funcionariocalidad';
/*
* This class represents the class definition.
*/
export class FuncionarioRegion {
	public TOTAL: number;
	public CALIDADES: FuncionarioCalidad[];
	public COMCODREGION: string;
	/* CONSTRUCTOR */
	constructor() {
		this.TOTAL = 0;
		this.CALIDADES = [];
	}
	
}