export class Feature{
	// 1: POINT, 2: MULTIPOINT, 3: LINE, 4:MULTILINE 5: POLYGON 6:MULTIPOLYGON
	private type:number;
	private feature:any;
	//METADATA
	private metadata:any[];
	private visible:boolean;
	//CONSTRUCTOR
	constructor(feature:any, type:number, metadata:any){
		
	}
	// FUNCION DE RENDERIZADOS
	public render(){

	}
	public hide(){

	}
	public getMetadata(){

	}
}