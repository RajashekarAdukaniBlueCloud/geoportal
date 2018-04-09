/*
* This class represents the class definition.
*/
export class Commune {
	Name:string;
	Polygon:any;
	Commune:any;
	/* CONSTRUCTOR */
	constructor(name:string, poly:any, commune:any) {
		this.Name = name;
		this.Commune = commune;
		this.Polygon = poly;
	}
	
}