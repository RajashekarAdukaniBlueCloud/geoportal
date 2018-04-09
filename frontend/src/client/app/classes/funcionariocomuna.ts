import { FuncionarioCalidad } from './funcionariocalidad';
/*
* This class represents the class definition.
*/
export class FuncionarioComuna {
    public TOTAL: number;
    public COMCODGOBIERNO: string;
	/* CONSTRUCTOR */
	constructor(comuna:any = null) {
        if(comuna){
            this.TOTAL = comuna.TOTAL;
            this.COMCODGOBIERNO = comuna.COMCODGOBIERNO;
            return this;
        }
		this.TOTAL = 0;
	}
	
}