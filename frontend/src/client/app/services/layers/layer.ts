import { MapService } from '../map/map.service';
import { Feature } from './feature';

export class Layer{
	//VARIABLES
	// FEATURE QUE COMPONEN LA CAPA JUNTO A SUS PROPIEDADES
	private features:Feature[];
	// FEATURES QUE SE MANTIENE EN SELECCION
	private selected:Feature[];
	// FEATURES QUE SE MANTIENE EN SELECCION
	private elements:Element[];
	// VISIBILIDAD DE LA CAPA
	private visible:boolean;
	// NOMBRE DE LA CAPA
	private name:string;
	//CONSTRUCTOR DE LA CLASE
	constructor(map:MapService){

	}
	//
	public addPointFeature(){

	}
	public addMultipointFeature(){

	}
	public addLineFeature(){

	}
	public addMultilineFeature(){

	}
	public addPolygonFeature(){

	}
	public addMultipolygonFeature(){

	}
	public render(){

	}
	public hide(){

	}
	public renderOnly(index:number){
		
	}
	public hideOnly(index:number){

	}
}

